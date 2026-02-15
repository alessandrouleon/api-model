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
exports.__esModule = true;
exports.AuthController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var public_decorator_1 = require("../decorators/public.decorator");
var sign_in_user_dto_1 = require("../dto/sign-in-user.dto");
var AuthController = /** @class */ (function () {
    function AuthController(authUserService) {
        this.authUserService = authUserService;
    }
    AuthController.prototype.signInUser = function (signInDto) {
        return this.authUserService.signIn(signInDto.username, signInDto.password);
    };
    __decorate([
        public_decorator_1.Public(),
        common_1.Post('login-user'),
        common_1.HttpCode(common_1.HttpStatus.OK),
        swagger_1.ApiOperation({ summary: 'Realiza login do usuário' }),
        swagger_1.ApiBody({ type: sign_in_user_dto_1.SignInUserDto }),
        swagger_1.ApiResponse({
            status: 200,
            description: 'Login realizado com sucesso'
        }),
        swagger_1.ApiResponse({
            status: 401,
            description: 'Credenciais inválidas'
        }),
        __param(0, common_1.Body())
    ], AuthController.prototype, "signInUser");
    AuthController = __decorate([
        swagger_1.ApiTags('Auth'),
        common_1.Controller('auth')
    ], AuthController);
    return AuthController;
}());
exports.AuthController = AuthController;
