import { PaginationInterface } from '@/@shared/repository/repository.interface';
import { ROLES } from '@/modules/auth/enums/roles.enum';
import { UserIterfaces } from '@/modules/users/domain/entities/user.entity';

export class InputFindUserUseCaseDto {
    name: string;
    username: string;
    email: string;
    role: ROLES;
    isActive: boolean;
}


export interface OutputFindUsersUseCaseDto {
    result: UserIterfaces[];
    pagination: PaginationInterface;
}

