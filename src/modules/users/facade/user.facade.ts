import { FindFilterInterface } from "@/@shared/repository/repository.interface";
import { UserIterfaces } from "@/modules/users/domain/entities/user.entity";
import { CreateUserUseCase } from "@/modules/users/usecases/create/create.user.usecase";
import { InputCreateUserUseCaseDto, OutputCreateUserUseCaseDto } from "@/modules/users/usecases/create/create.user.usecase.dto";
import { DeleteUserUseCase } from "@/modules/users/usecases/delete/delete.user.usecase";
import { FindAllUserUseCase } from "@/modules/users/usecases/findAll/find-all.user.usecase";
import { FindByIdUserUseCase } from "@/modules/users/usecases/findById/findById.user.usecase";
import { OutputFindByIdUserUseCaseDto } from "@/modules/users/usecases/findById/findById.user.usecase.dto";
import { UpdateUserUseCase } from "@/modules/users/usecases/update/update.user.usecase";
import { InputUpdateUserUseCaseDto, OutputUpdateUserUseCaseDto } from "@/modules/users/usecases/update/update.user.usecase.dto";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UserFacade {
    constructor(
        private readonly createUserUseCase: CreateUserUseCase,
        private readonly findByIdUserUseCase: FindByIdUserUseCase,
        private readonly updateUserUseCase: UpdateUserUseCase,
        private readonly deleteUserUseCase: DeleteUserUseCase,
        private readonly findAllUserUseCase: FindAllUserUseCase
    ) { }

    async create(input: InputCreateUserUseCaseDto): Promise<OutputCreateUserUseCaseDto> {
        return await this.createUserUseCase.execute(input);
    }

    async update(input: InputUpdateUserUseCaseDto): Promise<OutputUpdateUserUseCaseDto> {
        return await this.updateUserUseCase.execute(input);
    }

    async findById(id: string): Promise<OutputFindByIdUserUseCaseDto> {
        return await this.findByIdUserUseCase.execute(id);
    }

    async find(filter: FindFilterInterface<UserIterfaces>) {
        return await this.findAllUserUseCase.execute(filter);
    }

    async delete(id: string): Promise<void> {
        return await this.deleteUserUseCase.execute(id);
    }
}