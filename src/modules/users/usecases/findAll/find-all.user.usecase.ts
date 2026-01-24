import { FindFilterInterface } from "@/@shared/repository/repository.interface";
import { UserRepositoryInterface } from "@/modules/users/repository/user.repository.interface";
import { OutputFindUsersUseCaseDto } from "@/modules/users/usecases/findAll/find-all.user.usecase.dto";
import { Inject, Injectable } from "@nestjs/common";


@Injectable()
export class FindAllUserUseCase {
    constructor(
        @Inject('UserRepositoryInterface')
        private readonly userRepository: UserRepositoryInterface,
    ) { }
    async execute(filter: FindFilterInterface): Promise<OutputFindUsersUseCaseDto> {

        const user = await this.userRepository.find(filter);

        return {
            result: user.result,
            pagination: user.pagination
        };
    }
}