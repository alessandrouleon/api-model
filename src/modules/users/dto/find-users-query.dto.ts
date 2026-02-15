import { ROLES } from '@/modules/auth/enums/roles.enum';

export class FindUsersQueryDto {
  id: string;

  name: string;

  email: string;

  roles: ROLES[];

  isActive: boolean;
}
