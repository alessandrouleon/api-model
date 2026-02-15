import {
  CurrentUser,
  ICurrentUser,
} from '@/modules/auth/decorators/current-user.decorator';
import { Roles } from '@/modules/auth/decorators/roles.decorator';
import { ROLES } from '@/modules/auth/enums/roles.enum';
import { CreateUserDto } from '@/modules/users/dto/create-user.dto';
import { UserFacade } from '@/modules/users/facade/user.facade';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FindUsersQueryDto } from '../dto/find-users-query.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@ApiTags('Users')
@ApiBearerAuth('access-token')
@Controller('users')
export class UserController {
  constructor(private readonly userFacade: UserFacade) {}

  // Apenas ADMIN pode criar usuários
  @Post()
  @Roles(ROLES.ADMIN)
  @ApiOperation({ summary: 'Criar usuário (USER)' })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Erro de validação' })
  async create(@Body() input: CreateUserDto) {
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
  @Roles(ROLES.ADMIN, ROLES.CLIENT_ADMIN)
  @ApiOperation({ summary: 'Atualizar usuário (USER)' })
  @ApiResponse({ status: 200, description: 'Usuário editado com sucesso' })
  @ApiResponse({ status: 400, description: 'Erro de validação' })
  async update(
    @Param('id') id: string,
    @Body() input: UpdateUserDto,
    @CurrentUser() currentUser: ICurrentUser,
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
  @Roles(ROLES.ADMIN, ROLES.CLIENT_ADMIN, ROLES.USER)
  @ApiParam({ name: 'id', type: String })
  @ApiOperation({ summary: 'Buscar usuário por ID' })
  @ApiResponse({ status: 200, description: 'Usuário encontrado' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
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
  @Roles(ROLES.ADMIN, ROLES.CLIENT_ADMIN, ROLES.MANAGER, ROLES.USER)
  @ApiOperation({ summary: 'LISTA DE USUARIOS' })
  @ApiResponse({ status: 200, description: 'Usuário encontrado' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async find(@Query() query: FindUsersQueryDto) {
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
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 204, description: 'Usuário removido com sucesso' })
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
