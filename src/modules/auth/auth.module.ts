import { UserModule } from '@/modules/users/user.module';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './controllers/auth.controller';
import { EncryptPassword } from './crypto/encrypt-password';
import { AuthGuard } from './guard/auth.guard';
import { RolesGuard } from './guard/roles.guard';
import { AuthUserService } from './services/auth-user.service';

@Module({
  imports: [
    UserModule,
    // JwtModule.register({
    //   global: true,
    //   secret: jwtConstants.secret,
    //   signOptions: { expiresIn: '1D', algorithm: 'HS256' },
    // }),

    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET_USER'),
        signOptions: { expiresIn: '1d', algorithm: 'HS256' },
      }),
    }),
  ],
  providers: [
    AuthUserService,
    AuthGuard,
    RolesGuard,
    {
      provide: 'ICryptoPassword',
      useClass: EncryptPassword,
    },
  ],
  controllers: [AuthController],
  exports: [AuthUserService, AuthGuard, RolesGuard],
})
export class AuthModule {}
