
import { CurrentUser, ICurrentUser } from '@/modules/auth/decorators/current-user.decorator';
import { Roles } from '@/modules/auth/decorators/roles.decorator';
import { ROLES } from '@/modules/auth/enums/roles.enum';
import { UserFacade } from "@/modules/users/facade/user.facade";
import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query
} from "@nestjs/common";

@Controller('users')
export class UserController {
    constructor(private readonly userFacade: UserFacade) { }

    // Apenas ADMIN pode criar usuários
    @Post()
    @Roles(ROLES.ADMIN)
    async create(@Body() input: any) {
        try {
            return await this.userFacade.create(input);
        } catch (e) {
            if (e.name === 'DomainError') {
                throw new BadRequestException(e.errors);
            }
            throw e;
        }
    }

    // ADMIN e MANAGER podem atualizar
    @Put(':id')
    @Roles(ROLES.ADMIN, ROLES.MANAGER)
    async update(
        @Param('id') id: string,
        @Body() input: any,
        @CurrentUser() currentUser: ICurrentUser // EXEMPLO de uso
    ) {
        try {
            input.id = id;
            return await this.userFacade.update(input);
        } catch (e) {
            if (e.name === 'DomainError') {
                throw new BadRequestException(e.errors);
            }
            throw e;
        }
    }

    // Qualquer usuário autenticado pode ver
    @Get(':id')
    @Roles(ROLES.ADMIN, ROLES.MANAGER, ROLES.USER)
    async findById(@Param('id') id: string) {
        try {
            return await this.userFacade.findById(id);
        } catch (e) {
            if (e.name === 'DomainError') {
                throw new BadRequestException(e.errors);
            }
            throw e;
        }
    }

    // Apenas ADMIN pode listar todos
    @Get()
    @Roles(ROLES.ADMIN, ROLES.MANAGER)
    async find(@Query() query: any) {
        const filter: any = {};
        for (const key in query) {
            if (key.startsWith('filter[') && key.endsWith(']')) {
                const field = key.slice(7, -1);
                filter[field] = query[key];
            }
        }
        return this.userFacade.find({ ...query, filter });
    }

    // Apenas ADMIN pode deletar
    @Delete(':id')
    @Roles(ROLES.ADMIN)
    async delete(@Param('id') id: string): Promise<void> {
        try {
            return await this.userFacade.delete(id);
        } catch (e) {
            if (e.name === 'DomainError') {
                throw new BadRequestException(e.errors);
            }
            throw e;
        }
    }
}