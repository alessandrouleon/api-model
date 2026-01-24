import { ICryptoPassword } from '@/modules/auth/crypto/crypto-password.interface';
import { LoginUserUseCase } from '@/modules/users/usecases/login/login-use.use-case';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthUserService {
  constructor(
    private loginUseUseCase: LoginUserUseCase,
    private jwtService: JwtService,
    @Inject('ICryptoPassword')
    private cryptoPassword: ICryptoPassword
  ) { }
  async signIn(username: string, pass: string): Promise<{ access_token: string }> {
    const user = await this.loginUseUseCase.authUsername(username);
    const isPasswordValid = await this.cryptoPassword.comparePassword(
      pass,
      user.password
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload = {
      username: user.username,
      userId: user.id,
      roles: user.roles,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
