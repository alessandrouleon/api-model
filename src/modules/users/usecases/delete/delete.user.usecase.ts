import { UserRepositoryInterface } from "@/modules/users/repository/user.repository.interface";
import { UserMessageHelper } from "@/utils/message/message.help";
import { HttpException, HttpStatus, Inject, Injectable, Logger } from "@nestjs/common";

@Injectable()
export class DeleteUserUseCase {
    constructor(
        @Inject('UserRepositoryInterface')
        private readonly userRepository: UserRepositoryInterface
    ) { }

    async execute(id: string): Promise<void> {

        const existsUser = await this.userRepository.findOneById(id);

        if (!existsUser) {
            throw new HttpException(
                UserMessageHelper.ID_NOT_EXIST_FOR_DELETED,
                HttpStatus.BAD_REQUEST,
            );
        }

        const deleteUser = await this.userRepository.delete(id);

        Logger.log(
            `User deleted. [ID: ${deleteUser.id}][name: ${deleteUser.name}]`,
            'DeleteUserUseCase.execute',
        );

    }
}
