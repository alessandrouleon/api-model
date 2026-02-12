"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var hash_service_1 = require("@/@shared/services/hash.service");
var roles_enum_1 = require("@/modules/auth/enums/roles.enum");
var message_help_1 = require("@/utils/message/message.help");
var common_1 = require("@nestjs/common");
var testing_1 = require("@nestjs/testing");
var update_user_usecase_1 = require("./update.user.usecase");
describe('UpdateUserUseCase', function () {
    var useCase;
    var userRepository;
    var hashService;
    var mockUser = {
        id: '123',
        name: 'John Doe',
        username: 'johndoe',
        email: 'john@example.com',
        password: '$2b$10$LDrk/MIaK3xdOvYganwXIuzRDeTDMzeJKRd6t3Sxja2pes14jRvii',
        roles: [roles_enum_1.ROLES.ADMIN],
        // isActive: true,
        toJSON: jest.fn().mockReturnValue({
            id: '123',
            name: 'John Doe',
            username: 'johndoe',
            email: 'john@example.com',
            roles: [roles_enum_1.ROLES.ADMIN],
            isActive: true
        })
    };
    beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockUserRepository, mockHashService, module;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockUserRepository = {
                        findOneById: jest.fn(),
                        findByUsername: jest.fn(),
                        findByEmail: jest.fn(),
                        update: jest.fn()
                    };
                    mockHashService = {
                        hash: jest.fn()
                    };
                    return [4 /*yield*/, testing_1.Test.createTestingModule({
                            providers: [
                                update_user_usecase_1.UpdateUserUseCase,
                                {
                                    provide: 'UserRepositoryInterface',
                                    useValue: mockUserRepository
                                },
                                {
                                    provide: hash_service_1.HashService,
                                    useValue: mockHashService
                                },
                            ]
                        }).compile()];
                case 1:
                    module = _a.sent();
                    useCase = module.get(update_user_usecase_1.UpdateUserUseCase);
                    userRepository = module.get('UserRepositoryInterface');
                    hashService = module.get(hash_service_1.HashService);
                    return [2 /*return*/];
            }
        });
    }); });
    afterEach(function () {
        jest.clearAllMocks();
    });
    describe('execute', function () {
        it('should update user successfully', function () { return __awaiter(void 0, void 0, void 0, function () {
            var input, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        input = {
                            id: '123',
                            name: 'John Updated',
                            username: 'johndoe',
                            email: 'john@example.com',
                            password: 'Admin@123',
                            roles: [roles_enum_1.ROLES.ADMIN],
                            isActive: true
                        };
                        userRepository.findOneById.mockResolvedValue(mockUser);
                        hashService.hash.mockResolvedValue('$2b$10$hashedNewPassword');
                        userRepository.update.mockResolvedValue(mockUser);
                        return [4 /*yield*/, useCase.execute(input)];
                    case 1:
                        result = _a.sent();
                        expect(userRepository.findOneById).toHaveBeenCalledWith(input.id);
                        expect(hashService.hash).toHaveBeenCalledWith(input.password);
                        expect(userRepository.update).toHaveBeenCalled();
                        expect(result).toEqual(mockUser.toJSON());
                        return [2 /*return*/];
                }
            });
        }); });
        it('should throw BadRequestException when user not found', function () { return __awaiter(void 0, void 0, void 0, function () {
            var input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        input = {
                            id: '999',
                            name: 'John Doe',
                            username: 'johndoe',
                            email: 'john@example.com',
                            password: 'Admin@123',
                            roles: [roles_enum_1.ROLES.ADMIN],
                            isActive: true
                        };
                        userRepository.findOneById.mockResolvedValue(null);
                        return [4 /*yield*/, expect(useCase.execute(input)).rejects.toThrow(new common_1.HttpException(message_help_1.UserMessageHelper.ID_NOT_EXIST, common_1.HttpStatus.BAD_REQUEST))];
                    case 1:
                        _a.sent();
                        expect(userRepository.findOneById).toHaveBeenCalledWith(input.id);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should throw BadRequestException when username already exists', function () { return __awaiter(void 0, void 0, void 0, function () {
            var input, existingUser, userWithSameUsername;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        input = {
                            id: '123',
                            name: 'John Doe',
                            username: 'newusername',
                            email: 'john@example.com',
                            password: 'Admin@123',
                            roles: [roles_enum_1.ROLES.ADMIN],
                            isActive: true
                        };
                        existingUser = __assign(__assign({}, mockUser), { username: 'johndoe' });
                        userWithSameUsername = __assign(__assign({}, mockUser), { username: 'newusername', id: '456' });
                        userRepository.findOneById.mockResolvedValue(existingUser);
                        userRepository.findByUsername.mockResolvedValue(userWithSameUsername);
                        return [4 /*yield*/, expect(useCase.execute(input)).rejects.toThrow(new common_1.HttpException(message_help_1.UserMessageHelper.EXIST_USERNAME_FOR_UPDATE, common_1.HttpStatus.BAD_REQUEST))];
                    case 1:
                        _a.sent();
                        expect(userRepository.findByUsername).toHaveBeenCalledWith(input.username);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should throw BadRequestException when email already exists', function () { return __awaiter(void 0, void 0, void 0, function () {
            var input, existingUser, userWithSameEmail;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        input = {
                            id: '123',
                            name: 'John Doe',
                            username: 'johndoe',
                            email: 'newemail@example.com',
                            password: 'Admin@123',
                            roles: [roles_enum_1.ROLES.ADMIN],
                            isActive: true
                        };
                        existingUser = __assign(__assign({}, mockUser), { email: 'john@example.com' });
                        userWithSameEmail = __assign(__assign({}, mockUser), { email: 'newemail@example.com', id: '456' });
                        userRepository.findOneById.mockResolvedValue(existingUser);
                        userRepository.findByEmail.mockResolvedValue(userWithSameEmail);
                        return [4 /*yield*/, expect(useCase.execute(input)).rejects.toThrow(new common_1.HttpException(message_help_1.UserMessageHelper.EXIST_EMAIL_FOR_UPDATE, common_1.HttpStatus.BAD_REQUEST))];
                    case 1:
                        _a.sent();
                        expect(userRepository.findByEmail).toHaveBeenCalledWith(input.email);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should allow updating username when it does not exist', function () { return __awaiter(void 0, void 0, void 0, function () {
            var input, existingUser, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        input = {
                            id: '123',
                            name: 'John Doe',
                            username: 'newusername',
                            email: 'john@example.com',
                            password: 'Admin@123',
                            roles: [roles_enum_1.ROLES.ADMIN],
                            isActive: true
                        };
                        existingUser = __assign(__assign({}, mockUser), { username: 'oldusername' });
                        userRepository.findOneById.mockResolvedValue(existingUser);
                        userRepository.findByUsername.mockResolvedValue(null);
                        hashService.hash.mockResolvedValue('$2b$10$hashedPassword');
                        userRepository.update.mockResolvedValue(mockUser);
                        return [4 /*yield*/, useCase.execute(input)];
                    case 1:
                        result = _a.sent();
                        expect(userRepository.findByUsername).toHaveBeenCalledWith(input.username);
                        expect(userRepository.update).toHaveBeenCalled();
                        expect(result).toEqual(mockUser.toJSON());
                        return [2 /*return*/];
                }
            });
        }); });
        it('should allow updating email when it does not exist', function () { return __awaiter(void 0, void 0, void 0, function () {
            var input, existingUser, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        input = {
                            id: '123',
                            name: 'John Doe',
                            username: 'johndoe',
                            email: 'newemail@example.com',
                            password: 'Admin@123',
                            roles: [roles_enum_1.ROLES.ADMIN],
                            isActive: true
                        };
                        existingUser = __assign(__assign({}, mockUser), { email: 'oldemail@example.com' });
                        userRepository.findOneById.mockResolvedValue(existingUser);
                        userRepository.findByEmail.mockResolvedValue(null);
                        hashService.hash.mockResolvedValue('$2b$10$hashedPassword');
                        userRepository.update.mockResolvedValue(mockUser);
                        return [4 /*yield*/, useCase.execute(input)];
                    case 1:
                        result = _a.sent();
                        expect(userRepository.findByEmail).toHaveBeenCalledWith(input.email);
                        expect(userRepository.update).toHaveBeenCalled();
                        expect(result).toEqual(mockUser.toJSON());
                        return [2 /*return*/];
                }
            });
        }); });
        it('should hash password before updating', function () { return __awaiter(void 0, void 0, void 0, function () {
            var input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        input = {
                            id: '123',
                            name: 'John Doe',
                            username: 'johndoe',
                            email: 'john@example.com',
                            password: 'Admin@123',
                            roles: [roles_enum_1.ROLES.ADMIN],
                            isActive: true
                        };
                        userRepository.findOneById.mockResolvedValue(mockUser);
                        hashService.hash.mockResolvedValue('$2b$10$hashedAdmin123');
                        userRepository.update.mockResolvedValue(mockUser);
                        return [4 /*yield*/, useCase.execute(input)];
                    case 1:
                        _a.sent();
                        expect(hashService.hash).toHaveBeenCalledWith('Admin@123');
                        expect(userRepository.update).toHaveBeenCalledWith(expect.objectContaining({
                            password: '$2b$10$hashedAdmin123'
                        }));
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not check username when it has not changed', function () { return __awaiter(void 0, void 0, void 0, function () {
            var input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        input = {
                            id: '123',
                            name: 'John Updated',
                            username: 'johndoe',
                            email: 'john@example.com',
                            password: 'Admin@123',
                            roles: [roles_enum_1.ROLES.ADMIN],
                            isActive: true
                        };
                        userRepository.findOneById.mockResolvedValue(mockUser);
                        hashService.hash.mockResolvedValue('$2b$10$hashedPassword');
                        userRepository.update.mockResolvedValue(mockUser);
                        return [4 /*yield*/, useCase.execute(input)];
                    case 1:
                        _a.sent();
                        expect(userRepository.findByUsername).not.toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not check email when it has not changed', function () { return __awaiter(void 0, void 0, void 0, function () {
            var input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        input = {
                            id: '123',
                            name: 'John Updated',
                            username: 'johndoe',
                            email: 'john@example.com',
                            password: 'Admin@123',
                            roles: [roles_enum_1.ROLES.ADMIN],
                            isActive: true
                        };
                        userRepository.findOneById.mockResolvedValue(mockUser);
                        hashService.hash.mockResolvedValue('$2b$10$hashedPassword');
                        userRepository.update.mockResolvedValue(mockUser);
                        return [4 /*yield*/, useCase.execute(input)];
                    case 1:
                        _a.sent();
                        expect(userRepository.findByEmail).not.toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
