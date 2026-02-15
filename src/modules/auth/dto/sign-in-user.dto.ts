// sign-in-user.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class SignInUserDto {
  @ApiProperty({
    example: 'admin',
    description: 'Nome de usuário cadastrado',
  })
  username: string;

  @ApiProperty({
    example: 'User@123',
    description: 'Senha do usuário',
  })
  password: string;
}
