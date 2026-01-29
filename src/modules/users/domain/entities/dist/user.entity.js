"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.UserEntity = void 0;
var entity_abstract_1 = require("@/@shared/domain/entity/entity.abstract");
var notification_error_1 = require("@/@shared/domain/notification/notification.error");
var user_validator_factory_1 = require("../../factory/user.validator.factory");
var UserEntity = /** @class */ (function (_super) {
    __extends(UserEntity, _super);
    function UserEntity(props) {
        var _a;
        var _this = _super.call(this, props.id, props.createdAt, props.updatedAt, props.deletedAt) || this;
        _this.props = props;
        _this._name = props.name;
        _this._username = props.username;
        _this._email = props.email;
        _this._password = props.password;
        _this._roles = props.roles;
        _this._isActive = (_a = props.isActive) !== null && _a !== void 0 ? _a : true;
        _this.validate();
        if (_this.notifications.hasErrors()) {
            throw new notification_error_1["default"](_this.notifications.getErrors());
        }
        return _this;
    }
    UserEntity.prototype.validate = function () {
        user_validator_factory_1.UserValidatorFactory.create().validate(this);
    };
    Object.defineProperty(UserEntity.prototype, "name", {
        get: function () {
            return this._name;
        },
        set: function (value) {
            this._name = value.trim();
            this.validate();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(UserEntity.prototype, "username", {
        get: function () {
            return this._username;
        },
        set: function (value) {
            this._username = value.trim();
            this.validate();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(UserEntity.prototype, "email", {
        get: function () {
            return this._email;
        },
        set: function (value) {
            this._email = value.trim();
            this.validate();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(UserEntity.prototype, "password", {
        get: function () {
            return this._password;
        },
        set: function (value) {
            this._password = value.trim();
            this.validate();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(UserEntity.prototype, "roles", {
        get: function () {
            return this._roles;
        },
        set: function (value) {
            if (!value || value.length === 0) {
                throw new notification_error_1["default"]([
                    {
                        context: 'user',
                        message: 'Roles are required'
                    },
                ]);
            }
            this._roles = value;
            this.validate();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(UserEntity.prototype, "isActive", {
        get: function () {
            return this._isActive;
        },
        set: function (value) {
            this._isActive = value;
        },
        enumerable: false,
        configurable: true
    });
    UserEntity.prototype.toJSON = function () {
        return {
            id: this.id,
            name: this.name,
            username: this.username,
            email: this.email,
            roles: this.roles,
            isActive: this.isActive,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            deletedAt: this.deletedAt
        };
    };
    return UserEntity;
}(entity_abstract_1["default"]));
exports.UserEntity = UserEntity;
