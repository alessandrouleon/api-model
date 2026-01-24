import { ROLES } from '@/modules/auth/enums/roles.enum';
import { UserEntity } from '@/modules/users/domain/entities/user.entity';
import { UserRepository } from '@/modules/users/repository/user.repository';
import { Logger } from '@nestjs/common';
import { Model, Types } from 'mongoose';

// Mock da classe Model como função construtora
class MockUserModel {
    constructor(public data: any) {
        Object.assign(this, data);
    }

    static create = jest.fn();
    static findById = jest.fn();
    static findOneAndUpdate = jest.fn();
    static findOneAndDelete = jest.fn();
    static findOne = jest.fn();
    static countDocuments = jest.fn();
    static find = jest.fn();

    toObject() {
        return { ...this.data };
    }

    save = jest.fn();
}

beforeEach(() => {
    jest.clearAllMocks();
});

// Função auxiliar para criar mock documents
const createMockUserDocument = (data: any) => {
    const _id = data._id || new Types.ObjectId(data.id);

    return {
        _id,
        name: data.name,
        username: data.username,
        email: data.email,
        password: data.password,
        roles: data.roles,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        toObject: jest.fn().mockReturnValue({
            _id,
            name: data.name,
            username: data.username,
            email: data.email,
            password: data.password,
            roles: data.roles,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
        }),
        save: jest.fn(),
    };
};

describe('UserRepository', () => {
    let repository: UserRepository;
    let userEntity: UserEntity;

    beforeEach(() => {
        jest.clearAllMocks();

        // Silenciar logs do NestJS nos testes
        jest.spyOn(Logger, 'warn').mockImplementation();
        jest.spyOn(Logger, 'error').mockImplementation();
        jest.spyOn(Logger, 'log').mockImplementation();

        // Usar MockUserModel como Model
        repository = new UserRepository(MockUserModel as unknown as Model<any>);

        userEntity = new UserEntity({
            id: '64b1f6c8a1d2f3e4b5c6d7f8',
            name: 'John Doe',
            username: 'johndoe',
            email: 'john@example.com',
            password: 'Admin@123',
            roles: [ROLES.ADMIN],
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    });

    describe('create', () => {
        it('should create a new user', async () => {
            const mockDocument = createMockUserDocument({
                id: userEntity.id,
                name: userEntity.name,
                username: userEntity.username,
                email: userEntity.email,
                password: userEntity.password,
                roles: userEntity.roles,
                createdAt: userEntity.createdAt,
                updatedAt: userEntity.updatedAt,
            });

            MockUserModel.create.mockResolvedValue(mockDocument);

            const result = await repository.create(userEntity);

            expect(MockUserModel.create).toHaveBeenCalled();
            expect(result).toBeInstanceOf(UserEntity);
            expect(result.id).toBe(userEntity.id);
            expect(result.name).toBe(userEntity.name);
            expect(result.email).toBe(userEntity.email);
        });
    });

    describe('update', () => {
        it('should update a user successfully', async () => {
            const originalDoc = {
                _id: new Types.ObjectId(userEntity.id),
                name: 'Old Name',
                username: 'oldusername',
                email: 'old@example.com',
                password: 'OldPass@123',
                roles: [ROLES.USER],
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null
            };

            const updatedDoc = createMockUserDocument({
                id: userEntity.id,
                name: userEntity.name,
                username: userEntity.username,
                email: userEntity.email,
                password: userEntity.password,
                roles: userEntity.roles,
                createdAt: userEntity.createdAt,
                updatedAt: userEntity.updatedAt,
            });

            // Mock do findById (é chamado no seu método)
            MockUserModel.findById.mockResolvedValue(originalDoc);

            // Mock do findOne para retornar o original válido
            MockUserModel.findOne.mockReturnValue({
                setOptions: jest.fn().mockReturnThis(),
                lean: jest.fn().mockResolvedValue(originalDoc),
            });

            MockUserModel.findOneAndUpdate.mockResolvedValue(updatedDoc);

            const result = await repository.update(userEntity);

            expect(MockUserModel.findOneAndUpdate).toHaveBeenCalledWith(
                { _id: new Types.ObjectId(userEntity.id) },
                expect.objectContaining({
                    $set: expect.any(Object)
                }),
                expect.objectContaining({
                    new: true,
                    runValidators: true,
                    strict: true,
                })
            );
            expect(result).toBeInstanceOf(UserEntity);
            expect(result.id).toBe(userEntity.id);
            expect(result.name).toBe(userEntity.name);
            expect(result.email).toBe(userEntity.email);
        });
    });

    it('should soft delete a user successfully', async () => {
        const mockDocument = createMockUserDocument({
            id: userEntity.id,
            name: userEntity.name,
            username: userEntity.username,
            email: userEntity.email,
            password: userEntity.password,
            roles: userEntity.roles,
            createdAt: userEntity.createdAt,
            updatedAt: userEntity.updatedAt,
        });

        MockUserModel.findOneAndUpdate.mockReturnValue({
            setOptions: jest.fn().mockReturnValue(mockDocument),
        });

        await repository.delete(userEntity.id);

        expect(MockUserModel.findOneAndUpdate).toHaveBeenCalledWith(
            { _id: new Types.ObjectId(userEntity.id) },
            { $set: { deletedAt: expect.any(Date) } },
            { new: true, strict: true, runValidators: true }
        );
    });

    describe('findOneById', () => {
        it('should find a user by id', async () => {
            const mockDocument = createMockUserDocument({
                id: userEntity.id,
                name: userEntity.name,
                username: userEntity.username,
                email: userEntity.email,
                password: userEntity.password,
                roles: userEntity.roles,
                createdAt: userEntity.createdAt,
                updatedAt: userEntity.updatedAt,
            });

            MockUserModel.findOne.mockReturnValue({
                exec: jest.fn().mockResolvedValue(mockDocument),

            });

            const result = await repository.findOneById(userEntity.id);

            expect(MockUserModel.findOne).toHaveBeenCalledWith({
                _id: new Types.ObjectId(userEntity.id),
                $or: [
                    { deletedAt: { $exists: false } },
                    { deletedAt: null },
                ]
            });
            expect(result).toBeInstanceOf(UserEntity);
            expect(result.id).toBe(userEntity.id);
        });

        it('should return null when user not found', async () => {
            MockUserModel.findOne.mockReturnValue({
                exec: jest.fn().mockResolvedValue(null),
            });

            const result = await repository.findOneById(userEntity.id);

            expect(result).toBeNull();
        });
    });

    describe('find', () => {
        it('should find users with pagination', async () => {
            const mockDocuments = [
                createMockUserDocument({
                    id: userEntity.id,
                    name: userEntity.name,
                    username: userEntity.username,
                    email: userEntity.email,
                    password: userEntity.password,
                    roles: userEntity.roles,
                    createdAt: userEntity.createdAt,
                    updatedAt: userEntity.updatedAt,
                }),
            ];

            MockUserModel.countDocuments.mockReturnValue({
                exec: jest.fn().mockResolvedValue(1),
            });

            MockUserModel.find.mockReturnValue({
                sort: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
                lean: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue(mockDocuments.map(d => d.toObject())),
            });

            const result = await repository.find({
                filter: { name: 'John' },
                limit: 10,
                skip: 0,
            });

            expect(result.result).toHaveLength(1);
            expect(result.result[0]).toBeInstanceOf(UserEntity);
            expect(result.pagination.total).toBe(1);
            expect(result.pagination.page).toBe(1);
        });

        it('should search users by multiple fields', async () => {
            MockUserModel.countDocuments.mockReturnValue({
                exec: jest.fn().mockResolvedValue(0),
            });

            MockUserModel.find.mockReturnValue({
                sort: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
                lean: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue([]),
            });

            const result = await repository.find({
                filter: { search: 'test' },
                limit: 10,
                skip: 0,
            });

            expect(MockUserModel.find).toHaveBeenCalledWith(
                expect.objectContaining({
                    $or: expect.arrayContaining([
                        { name: { $regex: 'test', $options: 'i' } },
                        { username: { $regex: 'test', $options: 'i' } },
                        { email: { $regex: 'test', $options: 'i' } },
                        { roles: { $regex: 'test', $options: 'i' } },
                    ]),
                })
            );
        });
    });
});