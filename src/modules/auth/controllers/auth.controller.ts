import { AuthUserService } from '@/modules/auth/services/auth-user.service';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../decorators/public.decorator';
import { SignInUserDto } from '../dto/sign-in-user.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authUserService: AuthUserService) {}
  @Public()
  @Post('login-user')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Realiza login do usuário' })
  @ApiBody({ type: SignInUserDto })
  @ApiResponse({
    status: 200,
    description: 'Login realizado com sucesso',
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciais inválidas',
  })
  signInUser(@Body() signInDto: SignInUserDto) {
    return this.authUserService.signIn(signInDto.username, signInDto.password);
  }
}
