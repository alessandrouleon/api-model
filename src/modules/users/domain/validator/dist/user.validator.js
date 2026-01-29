"use strict";
exports.__esModule = true;
exports.UserJoiValidator = void 0;
var notification_error_1 = require("@/@shared/domain/notification/notification.error");
var roles_enum_1 = require("@/modules/auth/enums/roles.enum");
var password_vo_1 = require("@/modules/users/domain/value-objects/password.vo");
var joi_1 = require("joi");
var UserJoiValidator = /** @class */ (function () {
    function UserJoiValidator() {
    }
    UserJoiValidator.prototype.validate = function (entity) {
        var schema = this.getSchema();
        var data = {
            id: entity.id,
            name: entity.name,
            username: entity.username,
            email: entity.email,
            password: entity.password,
            roles: entity.roles,
            isActive: entity.isActive,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt
        };
        var error = schema.validate(data, { abortEarly: false, allowUnknown: true }).error;
        if (error) {
            throw new notification_error_1["default"](error.details.map(function (detail) {
                var notificationErrors = {
                    context: 'user',
                    message: detail.message
                };
                return notificationErrors;
            }));
        }
    };
    UserJoiValidator.prototype.getSchema = function () {
        return joi_1["default"].object({
            id: joi_1["default"].string().required().messages({
                'any.required': 'Id is required',
                'string.base': 'Id must be a string',
                'string.empty': 'Id cannot be empty'
            }),
            name: joi_1["default"].string().trim().min(2).max(100).required().messages({
                'any.required': 'Name is required',
                'string.empty': 'Name cannot be empty',
                'string.min': 'Name must be at least 2 characters',
                'string.max': 'Name cannot exceed 100 characters',
                'string.base': 'Name must be a string'
            }),
            username: joi_1["default"].string().trim().min(2).max(50).required().messages({
                'any.required': 'Username is required',
                'string.empty': 'Username cannot be empty',
                'string.min': 'Username must be at least 2 characters',
                'string.max': 'Username cannot exceed 50 characters',
                'string.base': 'Username must be a string'
            }),
            email: joi_1["default"].string().trim().email().required().messages({
                'any.required': 'Email is required',
                'string.empty': 'Email cannot be empty',
                'string.email': 'Email must be a valid address',
                'string.base': 'Email must be a string'
            }),
            password: joi_1["default"].string()
                .trim()
                .min(8)
                .max(80)
                .pattern(password_vo_1.PASSWORD_REGEX)
                .required()
                .messages({
                'any.required': 'Password is required',
                'string.empty': 'Password cannot be empty',
                'string.min': 'Password must be at least 8 characters',
                'string.max': 'Password must be at most 80 characters',
                'string.base': 'Password must be a string',
                'string.pattern.base': password_vo_1.PASSWORD_INVALID_MESSAGE
            }),
            roles: joi_1["default"].array().items(joi_1["default"].string().valid(roles_enum_1.ROLES.ADMIN, roles_enum_1.ROLES.CLIENT_ADMIN, roles_enum_1.ROLES.USER, roles_enum_1.ROLES.GUEST, roles_enum_1.ROLES.MANAGER)).required().messages({
                'any.required': 'Roles are required',
                'array.includes': 'Roles must be ADMIN, CLIENT_ADMIN, USER, GUEST or MANAGER'
            }),
            isActive: joi_1["default"].boolean().required().messages({
                'any.required': 'isActive is required'
            }),
            createdAt: joi_1["default"].date().required().messages({
                'any.required': 'CreatedAt is required'
            }),
            updatedAt: joi_1["default"].date().required().messages({
                'any.required': 'UpdatedAt is required'
            }),
            deletedAt: joi_1["default"].date().optional().messages({
                'any.required': 'DeletedAt is required'
            })
        });
    };
    return UserJoiValidator;
}());
exports.UserJoiValidator = UserJoiValidator;
