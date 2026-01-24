import { ROLES } from "@/modules/auth/enums/roles.enum";

export class OutputFindByIdUserUseCaseDto {
    id: string;
    name: string;
    username: string;
    email: string;
    roles: ROLES[];
    createdAt: Date;
    updatedAt: Date;
}