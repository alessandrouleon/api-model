"use strict";
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
exports.UserRepository = void 0;
var user_entity_1 = require("@/modules/users/domain/entities/user.entity");
var user_model_1 = require("@/modules/users/models/user.model");
var common_1 = require("@nestjs/common");
var mongoose_1 = require("@nestjs/mongoose");
var mongoose_2 = require("mongoose");
var UserRepository = /** @class */ (function () {
    function UserRepository(userModel) {
        this.userModel = userModel;
    }
    UserRepository.prototype.create = function (entity) {
        return __awaiter(this, void 0, Promise, function () {
            var userModel, saveUser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userModel = this.entityToModel(entity);
                        return [4 /*yield*/, this.userModel.create(userModel)];
                    case 1:
                        saveUser = _a.sent();
                        if (!saveUser) {
                            common_1.Logger.warn("User creation failed", 'UserRepository.create');
                        }
                        return [2 /*return*/, this.modelToEntity(saveUser)];
                }
            });
        });
    };
    UserRepository.prototype.update = function (entity) {
        var _a, _b;
        return __awaiter(this, void 0, Promise, function () {
            var objId, originalDoc, updatePayload, updatedDoc, updatedSnap;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        objId = new mongoose_2.Types.ObjectId(entity.id);
                        return [4 /*yield*/, ((_b = (_a = this.userModel
                                .findOne({
                                _id: objId,
                                $or: [
                                    { deletedAt: { $exists: false } },
                                    { deletedAt: null },
                                ]
                            })).setOptions) === null || _b === void 0 ? void 0 : _b.call(_a, { autopopulate: false }).lean())];
                    case 1:
                        originalDoc = _c.sent();
                        if (!originalDoc) {
                            throw new common_1.NotFoundException("User " + entity.id + " not found");
                        }
                        updatePayload = this.entityToModel(entity);
                        if (originalDoc._id)
                            originalDoc._id = String(originalDoc._id);
                        if (originalDoc.__v !== undefined)
                            delete originalDoc.__v;
                        return [4 /*yield*/, this.userModel.findOneAndUpdate({ _id: objId }, { $set: updatePayload }, {
                                "new": true,
                                runValidators: true,
                                strict: true,
                                writeConcern: { w: 'majority', wtimeout: 5000 }
                            })];
                    case 2:
                        updatedDoc = _c.sent();
                        if (!updatedDoc) {
                            common_1.Logger.warn("Failed at update user " + entity.id, 'UserRepository.update');
                            throw new common_1.NotFoundException('User not found');
                        }
                        updatedSnap = updatedDoc.toObject();
                        if (updatedSnap._id)
                            updatedSnap._id = String(updatedSnap._id);
                        if (updatedSnap.__v !== undefined)
                            delete updatedSnap.__v;
                        return [2 /*return*/, this.modelToEntity(updatedDoc)];
                }
            });
        });
    };
    UserRepository.prototype["delete"] = function (_id) {
        var _a, _b;
        return __awaiter(this, void 0, Promise, function () {
            var objId, deleted, originalSnap;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        objId = new mongoose_2.Types.ObjectId(_id);
                        return [4 /*yield*/, ((_b = (_a = this.userModel
                                .findOneAndUpdate({ _id: objId }, { $set: { deletedAt: new Date() } }, {
                                "new": true,
                                strict: true,
                                runValidators: true
                            })).setOptions) === null || _b === void 0 ? void 0 : _b.call(_a, { autopopulate: false }))];
                    case 1:
                        deleted = _c.sent();
                        if (!deleted) {
                            common_1.Logger.warn("Failed at delete user " + _id, 'UserRepository.delete');
                            throw new common_1.NotFoundException("User " + _id + " not found");
                        }
                        originalSnap = deleted.toObject();
                        if (originalSnap === null || originalSnap === void 0 ? void 0 : originalSnap._id) {
                            originalSnap._id = originalSnap._id;
                        }
                        return [2 /*return*/, this.modelToEntity(deleted)];
                }
            });
        });
    };
    UserRepository.prototype.findOneById = function (id) {
        return __awaiter(this, void 0, Promise, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userModel.findOne({
                            _id: new mongoose_2.Types.ObjectId(id), $or: [
                                { deletedAt: { $exists: false } },
                                { deletedAt: null },
                            ]
                        }).exec()];
                    case 1:
                        user = _a.sent();
                        if (!user)
                            return [2 /*return*/, null];
                        return [2 /*return*/, this.modelToEntity(user)];
                }
            });
        });
    };
    UserRepository.prototype.findByUsername = function (username) {
        return __awaiter(this, void 0, Promise, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userModel.findOne({ username: username }).exec()];
                    case 1:
                        user = _a.sent();
                        if (!user)
                            return [2 /*return*/, null];
                        return [2 /*return*/, this.modelToEntity(user)];
                }
            });
        });
    };
    UserRepository.prototype.findByEmail = function (email) {
        return __awaiter(this, void 0, Promise, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userModel.findOne({ email: email }).exec()];
                    case 1:
                        user = _a.sent();
                        if (!user)
                            return [2 /*return*/, null];
                        return [2 /*return*/, this.modelToEntity(user)];
                }
            });
        });
    };
    UserRepository.prototype.find = function (query) {
        return __awaiter(this, void 0, Promise, function () {
            var _a, filter, _b, order, _c, orderby, _d, limit, _e, page, _f, skip, queryBuild, $or, total, totalPages, findQuery, users;
            var _g;
            var _this = this;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0:
                        _a = query.filter, filter = _a === void 0 ? {} : _a, _b = query.order, order = _b === void 0 ? "desc" : _b, _c = query.orderby, orderby = _c === void 0 ? "createdAt" : _c, _d = query.limit, limit = _d === void 0 ? 15 : _d, _e = query.page, page = _e === void 0 ? 1 : _e, _f = query.skip, skip = _f === void 0 ? (page - 1) * limit : _f;
                        queryBuild = {
                            deletedAt: { $in: [null, undefined] },
                            roles: { $ne: 'ADMIN' }
                        };
                        $or = [];
                        if (filter.name) {
                            $or.push({ name: { $regex: filter.name, $options: 'i' } });
                        }
                        else if (filter.search) {
                            $or.push({ name: { $regex: filter.search, $options: 'i' } });
                        }
                        if (filter.username) {
                            $or.push({ username: { $regex: filter.username, $options: 'i' } });
                        }
                        else if (filter.search) {
                            $or.push({ username: { $regex: filter.search, $options: 'i' } });
                        }
                        if (filter.email) {
                            $or.push({ email: { $regex: filter.email, $options: 'i' } });
                        }
                        else if (filter.search) {
                            $or.push({ email: { $regex: filter.search, $options: 'i' } });
                        }
                        if (filter.roles) {
                            $or.push({ roles: { $regex: filter.roles, $options: 'i' } });
                        }
                        else if (filter.search) {
                            $or.push({ roles: { $regex: filter.search, $options: 'i' } });
                        }
                        if ($or.length > 0) {
                            queryBuild['$or'] = $or;
                        }
                        return [4 /*yield*/, this.userModel.countDocuments(queryBuild).exec()];
                    case 1:
                        total = _h.sent();
                        totalPages = Math.ceil(total / limit);
                        findQuery = this.userModel
                            .find(queryBuild)
                            .sort((_g = {}, _g[orderby] = order === 'asc' ? 1 : -1, _g))
                            .skip(skip)
                            .limit(limit)
                            .lean();
                        return [4 /*yield*/, findQuery.exec()];
                    case 2:
                        users = _h.sent();
                        return [2 /*return*/, {
                                result: users.map(function (user) { return _this.modelToEntity(user); }),
                                pagination: {
                                    page: Number(page),
                                    totalPages: totalPages,
                                    size: limit,
                                    total: total
                                }
                            }];
                }
            });
        });
    };
    UserRepository.prototype.modelToEntity = function (userModel) {
        var userEntity = new user_entity_1.UserEntity({
            id: userModel._id.toString(),
            name: userModel.name,
            username: userModel.username,
            email: userModel.email,
            password: userModel.password,
            roles: userModel.roles,
            isActive: userModel.isActive,
            createdAt: userModel.createdAt,
            updatedAt: userModel.updatedAt,
            deletedAt: userModel.deletedAt
        });
        return userEntity;
    };
    UserRepository.prototype.entityToModel = function (entity) {
        var userModel = new this.userModel({
            _id: new mongoose_2.Types.ObjectId(entity.id),
            name: entity.name,
            username: entity.username,
            email: entity.email,
            password: entity.password,
            roles: entity.roles,
            isActive: entity.isActive,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt
        });
        return userModel;
    };
    UserRepository = __decorate([
        common_1.Injectable(),
        __param(0, mongoose_1.InjectModel(user_model_1.User.name))
    ], UserRepository);
    return UserRepository;
}());
exports.UserRepository = UserRepository;
