import { ROLES } from '@/modules/auth/enums/roles.enum';
import { UserEntity } from '@/modules/users/domain/entities/user.entity';
import { UserRepositoryInterface } from '@/modules/users/repository/user.repository.interface';
import { UserMessageHelper } from '@/utils/message/message.help';
import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { FindByIdUserUseCase } from './findById.user.usecase';
import { OutputFindByIdUserUseCaseDto } from './findById.user.usecase.dto';

describe('FindByIdUserUseCase', () => {
    let useCase: FindByIdUserUseCase;
    let userRepository: jest.Mocked<UserRepositoryInterface>;

    beforeEach(() => {
        userRepository = {
            findOneById: jest.fn(),
        } as any;

        // Evita logs no console durante o teste
        jest.spyOn(Logger, 'log').mockImplementation(jest.fn());

        useCase = new FindByIdUserUseCase(userRepository);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return user when found', async () => {
        const mockUser = new UserEntity({
            id: '123',
            name: 'John Doe',
            username: 'john.doe',
            email: 'john@example.com',
            password: 'Test@123',
            roles: [ROLES.ADMIN],
        });

        jest.spyOn(mockUser, 'toJSON').mockReturnValue({
            id: '123',
            name: 'John Doe',
            username: 'john.doe',
            email: 'john@example.com',
            roles: [ROLES.ADMIN],
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
        });

        userRepository.findOneById.mockResolvedValueOnce(mockUser);

        const result: OutputFindByIdUserUseCaseDto = await useCase.execute('123');

        expect(userRepository.findOneById).toHaveBeenCalledWith('123');
        expect(result).toEqual({
            id: '123',
            name: 'John Doe',
            email: 'john@example.com',
            username: 'john.doe',
            roles: [ROLES.ADMIN],
            isActive: true,
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
            deletedAt: null,
        });
        expect(Logger.log).toHaveBeenCalledWith(
            `User found. [ID: ${mockUser.id}][name: ${mockUser.name}]`,
            'FindByIdUserUseCase.execute',
        );
    });

    it('should throw BadRequestException when user not found', async () => {
        userRepository.findOneById.mockResolvedValueOnce(null);

        await expect(useCase.execute('999')).rejects.toThrow(
            new HttpException(UserMessageHelper.ID_NOT_EXIST,
                HttpStatus.BAD_REQUEST,),
        );

        expect(userRepository.findOneById).toHaveBeenCalledWith('999');
        expect(Logger.log).not.toHaveBeenCalled();
    });
});
