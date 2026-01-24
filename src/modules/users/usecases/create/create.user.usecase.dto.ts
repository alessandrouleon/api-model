import { ROLES } from "@/modules/auth/enums/roles.enum";

export class InputCreateUserUseCaseDto {
    id: string;
    name: string;
    username: string;
    email: string;
    password: string;
    roles: ROLES[];
}

export class OutputCreateUserUseCaseDto {
    id: string;
    name: string;
    username: string;
    email: string;
    roles: ROLES[];
    createdAt: Date;
    updatedAt: Date;
}