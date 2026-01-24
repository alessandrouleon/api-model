import { HashService } from '@/@shared/services/hash.service';
import { IdService } from '@/@shared/services/id.service';
import { ROLES } from '@/modules/auth/enums/roles.enum';
import { UserEntity } from '@/modules/users/domain/entities/user.entity';
import { UserRepositoryInterface } from '@/modules/users/repository/user.repository.interface';
import { CreateUserUseCase } from '@/modules/users/usecases/create/create.user.usecase';
import { BadRequestException } from '@nestjs/common';

describe('CreateUserUseCase', () => {
    let createUserUseCase: CreateUserUseCase;
    let userRepositoryMock: jest.Mocked<UserRepositoryInterface>;
    let idServiceMock: jest.Mocked<IdService>;
    let hashServiceMock: jest.Mocked<HashService>;

    beforeEach(() => {
        userRepositoryMock = {
            create: jest.fn(),
            findByUsername: jest.fn(),
            findByEmail: jest.fn(),
        } as any;

        idServiceMock = {
            generate: jest.fn(),
        } as any;

        hashServiceMock = {
            hash: jest.fn().mockResolvedValue('hashed_password'),
            compare: jest.fn(),
        } as any;

        createUserUseCase = new CreateUserUseCase(userRepositoryMock, idServiceMock, hashServiceMock);
    });

    it('should create a new user successfully', async () => {
        const input = {
            id: "123",
            name: 'John Doe',
            username: 'johndoe',
            email: 'john@example.com',
            password: 'Abc@1234',
            roles: [ROLES.ADMIN],
        };

        const generatedId = '6959d939884255f47e7a2df0';
        const hashedPassword = '$2b$10$peOKBntHgbpGLOatpVYUkO76rENaUcEqKG51vYjdssLap6A70M3FS';

        // Mock para verificações de duplicidade (retornam null = não existe)
        userRepositoryMock.findByUsername.mockResolvedValue(null);
        userRepositoryMock.findByEmail.mockResolvedValue(null);

        idServiceMock.generate.mockReturnValue(generatedId);
        hashServiceMock.hash.mockResolvedValue(hashedPassword);

        const createdUserEntity = new UserEntity({
            id: generatedId,
            name: input.name,
            username: input.username,
            email: input.email,
            password: hashedPassword,
            roles: input.roles,
        });

        const userJson = {
            id: generatedId,
            name: input.name,
            username: input.username,
            email: input.email,
            roles: input.roles,
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
        };

        jest.spyOn(createdUserEntity, 'toJSON').mockReturnValue(userJson);
        userRepositoryMock.create.mockResolvedValue(createdUserEntity);

        const result = await createUserUseCase.execute(input);

        expect(userRepositoryMock.findByUsername).toHaveBeenCalledWith(input.username);
        expect(userRepositoryMock.findByEmail).toHaveBeenCalledWith(input.email);
        expect(hashServiceMock.hash).toHaveBeenCalledWith("Abc@1234");
        expect(idServiceMock.generate).toHaveBeenCalledTimes(1);
        expect(userRepositoryMock.create).toHaveBeenCalledTimes(1);
        expect(userRepositoryMock.create).toHaveBeenCalledWith(expect.any(UserEntity));
        expect(result).toEqual(userJson);
    });

    it('should throw BadRequestException if username already exists', async () => {
        const input = {
            id: "123",
            name: 'John Doe',
            username: 'johndoe',
            email: 'john@example.com',
            password: 'Abc@1234',
            roles: [ROLES.ADMIN],
        };

        const existingUser = {
            id: 'existing-id',
            username: 'johndoe',
            email: 'other@example.com',
        } as UserEntity;

        userRepositoryMock.findByUsername.mockResolvedValue(existingUser);
        userRepositoryMock.findByEmail.mockResolvedValue(null);

        await expect(createUserUseCase.execute(input)).rejects.toThrow(BadRequestException);
        await expect(createUserUseCase.execute(input)).rejects.toThrow('User already registered with this username');
    });

    it('should throw BadRequestException if email already exists', async () => {
        const input = {
            id: "123",
            name: 'John Doe',
            username: 'johndoe',
            email: 'john@example.com',
            password: 'Abc@1234',
            roles: [ROLES.ADMIN],
        };

        const existingUser = {
            id: 'existing-id',
            username: 'otheruser',
            email: 'john@example.com',
        } as UserEntity;

        userRepositoryMock.findByUsername.mockResolvedValue(null);
        userRepositoryMock.findByEmail.mockResolvedValue(existingUser);

        await expect(createUserUseCase.execute(input)).rejects.toThrow(BadRequestException);
        await expect(createUserUseCase.execute(input)).rejects.toThrow('User already registered with this email');
    });

    it('should throw if repository.create fails', async () => {
        const input = {
            id: "123",
            name: 'Jane Doe',
            username: 'janedoe',
            email: 'jane@example.com',
            password: 'Xyz@9876',
            roles: [ROLES.USER],
        };

        userRepositoryMock.findByUsername.mockResolvedValue(null);
        userRepositoryMock.findByEmail.mockResolvedValue(null);
        idServiceMock.generate.mockReturnValue('xyz789');
        hashServiceMock.hash.mockResolvedValue('$2b$10$peOKBntHgbpGLOatpVYUkO76rENaUcEqKG51vYjdssLap6A70M3FS');
        userRepositoryMock.create.mockRejectedValue(new Error('Database error'));

        await expect(createUserUseCase.execute(input)).rejects.toThrow('Database error');
    });
});