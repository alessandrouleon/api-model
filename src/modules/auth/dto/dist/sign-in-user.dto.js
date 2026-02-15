"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.SignInUserDto = void 0;
// sign-in-user.dto.ts
var swagger_1 = require("@nestjs/swagger");
var SignInUserDto = /** @class */ (function () {
    function SignInUserDto() {
    }
    __decorate([
        swagger_1.ApiProperty({
            example: 'admin',
            description: 'Nome de usuário cadastrado'
        })
    ], SignInUserDto.prototype, "username");
    __decorate([
        swagger_1.ApiProperty({
            example: 'User@123',
            description: 'Senha do usuário'
        })
    ], SignInUserDto.prototype, "password");
    return SignInUserDto;
}());
exports.SignInUserDto = SignInUserDto;
