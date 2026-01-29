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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
exports.UserController = void 0;
var current_user_decorator_1 = require("@/modules/auth/decorators/current-user.decorator");
var roles_decorator_1 = require("@/modules/auth/decorators/roles.decorator");
var roles_enum_1 = require("@/modules/auth/enums/roles.enum");
var common_1 = require("@nestjs/common");
var UserController = /** @class */ (function () {
    function UserController(userFacade) {
        this.userFacade = userFacade;
    }
    // Apenas ADMIN pode criar usuários
    UserController.prototype.create = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            var e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.userFacade.create(input)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        e_1 = _a.sent();
                        if (e_1.name === 'DomainError') {
                            throw new common_1.BadRequestException(e_1.errors);
                        }
                        throw e_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // ADMIN e MANAGER podem atualizar
    UserController.prototype.update = function (id, input, currentUser // EXEMPLO de uso
    ) {
        return __awaiter(this, void 0, void 0, function () {
            var e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        input.id = id;
                        return [4 /*yield*/, this.userFacade.update(input)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        e_2 = _a.sent();
                        if (e_2.name === 'DomainError') {
                            throw new common_1.BadRequestException(e_2.errors);
                        }
                        throw e_2;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Qualquer usuário autenticado pode ver
    UserController.prototype.findById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.userFacade.findById(id)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        e_3 = _a.sent();
                        if (e_3.name === 'DomainError') {
                            throw new common_1.BadRequestException(e_3.errors);
                        }
                        throw e_3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Apenas ADMIN pode listar todos
    UserController.prototype.find = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var filter, key, field;
            return __generator(this, function (_a) {
                filter = {};
                for (key in query) {
                    if (key.startsWith('filter[') && key.endsWith(']')) {
                        field = key.slice(7, -1);
                        filter[field] = query[key];
                    }
                }
                return [2 /*return*/, this.userFacade.find(__assign(__assign({}, query), { filter: filter }))];
            });
        });
    };
    // Apenas ADMIN pode deletar
    UserController.prototype["delete"] = function (id) {
        return __awaiter(this, void 0, Promise, function () {
            var e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.userFacade["delete"](id)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        e_4 = _a.sent();
                        if (e_4.name === 'DomainError') {
                            throw new common_1.BadRequestException(e_4.errors);
                        }
                        throw e_4;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        common_1.Post(),
        roles_decorator_1.Roles(roles_enum_1.ROLES.ADMIN),
        __param(0, common_1.Body())
    ], UserController.prototype, "create");
    __decorate([
        common_1.Put(':id'),
        roles_decorator_1.Roles(roles_enum_1.ROLES.ADMIN, roles_enum_1.ROLES.CLIENT_ADMIN),
        __param(0, common_1.Param('id')),
        __param(1, common_1.Body()),
        __param(2, current_user_decorator_1.CurrentUser())
    ], UserController.prototype, "update");
    __decorate([
        common_1.Get(':id'),
        roles_decorator_1.Roles(roles_enum_1.ROLES.ADMIN, roles_enum_1.ROLES.CLIENT_ADMIN, roles_enum_1.ROLES.USER),
        __param(0, common_1.Param('id'))
    ], UserController.prototype, "findById");
    __decorate([
        common_1.Get(),
        roles_decorator_1.Roles(roles_enum_1.ROLES.ADMIN, roles_enum_1.ROLES.CLIENT_ADMIN, roles_enum_1.ROLES.MANAGER, roles_enum_1.ROLES.USER),
        __param(0, common_1.Query())
    ], UserController.prototype, "find");
    __decorate([
        common_1.Delete(':id'),
        roles_decorator_1.Roles(roles_enum_1.ROLES.ADMIN),
        __param(0, common_1.Param('id'))
    ], UserController.prototype, "delete");
    UserController = __decorate([
        common_1.Controller('users')
    ], UserController);
    return UserController;
}());
exports.UserController = UserController;
