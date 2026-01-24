import { FindFilterInterface } from '@/@shared/repository/repository.interface';
import { UserRepositoryInterface } from '@/modules/users/repository/user.repository.interface';
import { FindAllUserUseCase } from '@/modules/users/usecases/findAll/find-all.user.usecase';

describe('FindAllUserUseCase', () => {
    let useCase: FindAllUserUseCase;
    let userRepository: jest.Mocked<UserRepositoryInterface>;

    beforeEach(() => {
        userRepository = {
            find: jest.fn(),
        } as unknown as jest.Mocked<UserRepositoryInterface>;

        useCase = new FindAllUserUseCase(userRepository);
    });

    it('should call the repository with the filters and return the expected result', async () => {
        const mockFilter: FindFilterInterface = {
            filter: { name: 'John' },
            order: 'asc',
            orderby: 'createdAt',
            limit: 10,
            page: 1,
            skip: 0,
        };

        const mockResponse = {
            result: [{ id: '1', name: 'John' }],
            pagination: { page: 1, total: 1, size: 10, hasNextPage: false },
        };

        // Aqui o método existe de fato, porque foi definido como jest.fn() acima
        (userRepository.find as jest.Mock).mockResolvedValueOnce(mockResponse);

        const output = await useCase.execute(mockFilter);

        expect(userRepository.find).toHaveBeenCalledTimes(1);
        expect(userRepository.find).toHaveBeenCalledWith(mockFilter);
        expect(output).toEqual({
            result: mockResponse.result,
            pagination: mockResponse.pagination,
        });
    });

    it('should throw an error if the repository fails', async () => {
        const mockFilter: FindFilterInterface = { filter: {} } as any;

        (userRepository.find as jest.Mock).mockRejectedValueOnce(new Error('DB error'));

        await expect(useCase.execute(mockFilter)).rejects.toThrow('DB error');
    });
});
