import { HashService } from '@/@shared/services/hash.service';
import { ROLES } from '@/modules/auth/enums/roles.enum';
import { UserRepositoryInterface } from '@/modules/users/repository/user.repository.interface';
import { UserMessageHelper } from '@/utils/message/message.help';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UpdateUserUseCase } from './update.user.usecase';
import { InputUpdateUserUseCaseDto } from './update.user.usecase.dto';

describe('UpdateUserUseCase', () => {
    let useCase: UpdateUserUseCase;
    let userRepository: jest.Mocked<UserRepositoryInterface>;
    let hashService: jest.Mocked<HashService>;

    const mockUser = {
        id: '123',
        name: 'John Doe',
        username: 'johndoe',
        email: 'john@example.com',
        password: '$2b$10$LDrk/MIaK3xdOvYganwXIuzRDeTDMzeJKRd6t3Sxja2pes14jRvii',
        roles: [ROLES.ADMIN],
        toJSON: jest.fn().mockReturnValue({
            id: '123',
            name: 'John Doe',
            username: 'johndoe',
            email: 'john@example.com',
            roles: [ROLES.ADMIN],
            isActive: true,
        }),
    };

    beforeEach(async () => {
        const mockUserRepository = {
            findOneById: jest.fn(),
            findByUsername: jest.fn(),
            findByEmail: jest.fn(),
            update: jest.fn(),
        };

        const mockHashService = {
            hash: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UpdateUserUseCase,
                {
                    provide: 'UserRepositoryInterface',
                    useValue: mockUserRepository,
                },
                {
                    provide: HashService,
                    useValue: mockHashService,
                },
            ],
        }).compile();

        useCase = module.get<UpdateUserUseCase>(UpdateUserUseCase);
        userRepository = module.get('UserRepositoryInterface');
        hashService = module.get(HashService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('execute', () => {
        it('should update user successfully', async () => {
            const input: InputUpdateUserUseCaseDto = {
                id: '123',
                name: 'John Updated',
                username: 'johndoe',
                email: 'john@example.com',
                password: 'Admin@123',
                roles: [ROLES.ADMIN],
                isActive: true,
            };

            userRepository.findOneById.mockResolvedValue(mockUser as any);
            hashService.hash.mockResolvedValue('$2b$10$hashedNewPassword');
            userRepository.update.mockResolvedValue(mockUser as any);

            const result = await useCase.execute(input);

            expect(userRepository.findOneById).toHaveBeenCalledWith(input.id);
            expect(hashService.hash).toHaveBeenCalledWith(input.password);
            expect(userRepository.update).toHaveBeenCalled();
            expect(result).toEqual(mockUser.toJSON());
        });

        it('should throw BadRequestException when user not found', async () => {
            const input: InputUpdateUserUseCaseDto = {
                id: '999',
                name: 'John Doe',
                username: 'johndoe',
                email: 'john@example.com',
                password: 'Admin@123',
                roles: [ROLES.ADMIN],
                isActive: true,
            };

            userRepository.findOneById.mockResolvedValue(null);

            await expect(useCase.execute(input)).rejects.toThrow(
                new HttpException(UserMessageHelper.ID_NOT_EXIST, HttpStatus.BAD_REQUEST),
            );
            expect(userRepository.findOneById).toHaveBeenCalledWith(input.id);
        });

        it('should throw BadRequestException when username already exists', async () => {
            const input: InputUpdateUserUseCaseDto = {
                id: '123',
                name: 'John Doe',
                username: 'newusername',
                email: 'john@example.com',
                password: 'Admin@123',
                roles: [ROLES.ADMIN],
                isActive: true,
            };

            const existingUser = { ...mockUser, username: 'johndoe' };
            const userWithSameUsername = { ...mockUser, username: 'newusername', id: '456' };

            userRepository.findOneById.mockResolvedValue(existingUser as any);
            userRepository.findByUsername.mockResolvedValue(userWithSameUsername as any);

            await expect(useCase.execute(input)).rejects.toThrow(
                new HttpException(UserMessageHelper.EXIST_USERNAME_FOR_UPDATE, HttpStatus.BAD_REQUEST),
            );
            expect(userRepository.findByUsername).toHaveBeenCalledWith(input.username);
        });

        it('should throw BadRequestException when email already exists', async () => {
            const input: InputUpdateUserUseCaseDto = {
                id: '123',
                name: 'John Doe',
                username: 'johndoe',
                email: 'newemail@example.com',
                password: 'Admin@123',
                roles: [ROLES.ADMIN],
                isActive: true,
            };

            const existingUser = { ...mockUser, email: 'john@example.com' };
            const userWithSameEmail = { ...mockUser, email: 'newemail@example.com', id: '456' };

            userRepository.findOneById.mockResolvedValue(existingUser as any);
            userRepository.findByEmail.mockResolvedValue(userWithSameEmail as any);

            await expect(useCase.execute(input)).rejects.toThrow(
                new HttpException(UserMessageHelper.EXIST_EMAIL_FOR_UPDATE, HttpStatus.BAD_REQUEST),
            );
            expect(userRepository.findByEmail).toHaveBeenCalledWith(input.email);
        });

        it('should allow updating username when it does not exist', async () => {
            const input: InputUpdateUserUseCaseDto = {
                id: '123',
                name: 'John Doe',
                username: 'newusername',
                email: 'john@example.com',
                password: 'Admin@123',
                roles: [ROLES.ADMIN],
                isActive: true,
            };

            const existingUser = { ...mockUser, username: 'oldusername' };

            userRepository.findOneById.mockResolvedValue(existingUser as any);
            userRepository.findByUsername.mockResolvedValue(null);
            hashService.hash.mockResolvedValue('$2b$10$hashedPassword');
            userRepository.update.mockResolvedValue(mockUser as any);

            const result = await useCase.execute(input);

            expect(userRepository.findByUsername).toHaveBeenCalledWith(input.username);
            expect(userRepository.update).toHaveBeenCalled();
            expect(result).toEqual(mockUser.toJSON());
        });

        it('should allow updating email when it does not exist', async () => {
            const input: InputUpdateUserUseCaseDto = {
                id: '123',
                name: 'John Doe',
                username: 'johndoe',
                email: 'newemail@example.com',
                password: 'Admin@123',
                roles: [ROLES.ADMIN],
                isActive: true,
            };

            const existingUser = { ...mockUser, email: 'oldemail@example.com' };

            userRepository.findOneById.mockResolvedValue(existingUser as any);
            userRepository.findByEmail.mockResolvedValue(null);
            hashService.hash.mockResolvedValue('$2b$10$hashedPassword');
            userRepository.update.mockResolvedValue(mockUser as any);

            const result = await useCase.execute(input);

            expect(userRepository.findByEmail).toHaveBeenCalledWith(input.email);
            expect(userRepository.update).toHaveBeenCalled();
            expect(result).toEqual(mockUser.toJSON());
        });

        it('should hash password before updating', async () => {
            const input: InputUpdateUserUseCaseDto = {
                id: '123',
                name: 'John Doe',
                username: 'johndoe',
                email: 'john@example.com',
                password: 'Admin@123',
                roles: [ROLES.ADMIN],
                isActive: true,
            };

            userRepository.findOneById.mockResolvedValue(mockUser as any);
            hashService.hash.mockResolvedValue('$2b$10$hashedAdmin123');
            userRepository.update.mockResolvedValue(mockUser as any);

            await useCase.execute(input);

            expect(hashService.hash).toHaveBeenCalledWith('Admin@123');
            expect(userRepository.update).toHaveBeenCalledWith(
                expect.objectContaining({
                    password: '$2b$10$hashedAdmin123',
                }),
            );
        });

        it('should not check username when it has not changed', async () => {
            const input: InputUpdateUserUseCaseDto = {
                id: '123',
                name: 'John Updated',
                username: 'johndoe',
                email: 'john@example.com',
                password: 'Admin@123',
                roles: [ROLES.ADMIN],
                isActive: true,
            };

            userRepository.findOneById.mockResolvedValue(mockUser as any);
            hashService.hash.mockResolvedValue('$2b$10$hashedPassword');
            userRepository.update.mockResolvedValue(mockUser as any);

            await useCase.execute(input);

            expect(userRepository.findByUsername).not.toHaveBeenCalled();
        });

        it('should not check email when it has not changed', async () => {
            const input: InputUpdateUserUseCaseDto = {
                id: '123',
                name: 'John Updated',
                username: 'johndoe',
                email: 'john@example.com',
                password: 'Admin@123',
                roles: [ROLES.ADMIN],
                isActive: true,
            };

            userRepository.findOneById.mockResolvedValue(mockUser as any);
            hashService.hash.mockResolvedValue('$2b$10$hashedPassword');
            userRepository.update.mockResolvedValue(mockUser as any);

            await useCase.execute(input);

            expect(userRepository.findByEmail).not.toHaveBeenCalled();
        });
    });
});