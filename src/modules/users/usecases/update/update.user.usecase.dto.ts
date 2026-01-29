import { ROLES } from "@/modules/auth/enums/roles.enum";

export class InputUpdateUserUseCaseDto {
    id: string;
    name: string;
    username: string;
    email: string;
    password: string;
    roles: ROLES[];
    isActive: boolean;
}

export class OutputUpdateUserUseCaseDto {
    id: string;
    name: string;
    username: string;
    email: string;
    roles: ROLES[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}