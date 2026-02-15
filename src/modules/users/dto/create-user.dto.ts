import { ROLES } from '@/modules/auth/enums/roles.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ example: 'Usuário' })
  name: string;

  @ApiProperty({ example: 'username' })
  username: string;

  @ApiProperty({ example: 'email@email.com' })
  email: string;

  @ApiProperty({ example: 'User@123' })
  password: string;

  @ApiProperty({ enum: ROLES, isArray: true })
  roles: ROLES[];

  @ApiProperty({ example: true })
  isActive: boolean;
}
