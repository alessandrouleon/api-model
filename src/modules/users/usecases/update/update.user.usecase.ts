import { HashService } from "@/@shared/services/hash.service";
import { UserRepositoryInterface } from "@/modules/users/repository/user.repository.interface";
import { BadRequestException, Inject, Injectable, Logger } from "@nestjs/common";
import UserFactory from "../../factory/user.factory";
import { InputUpdateUserUseCaseDto, OutputUpdateUserUseCaseDto } from "./update.user.usecase.dto";


@Injectable()
export class UpdateUserUseCase {
    constructor(
        @Inject('UserRepositoryInterface')
        private readonly userRepository: UserRepositoryInterface,
        private readonly hashService: HashService
    ) { }
    async execute(input: InputUpdateUserUseCaseDto): Promise<OutputUpdateUserUseCaseDto> {

        const existeUser = await this.userRepository.findOneById(input.id);

        if (!existeUser) {
            throw new BadRequestException(`User with ID ${input.id} not found`);
        }

        if (input && input.username !== existeUser.username) {
            const getUsername = await this.userRepository.findByUsername(input.username);
            if (getUsername) {
                throw new BadRequestException('User already registered with this username');
            }
        }

        if (input && input.email !== existeUser.email) {
            const getEmail = await this.userRepository.findByEmail(input.email);
            if (getEmail) {
                throw new BadRequestException('User already registered with this email');
            }
        }

        const user = UserFactory.createUserFactory({
            id: input.id,
            name: input.name,
            username: input.username,
            email: input.email,
            password: input.password,
            roles: input.roles
        });

        user.password = await this.hashService.hash(user.password);
        const userUpdated = await this.userRepository.update(user);

        Logger.log(
            `User updated. [ID: ${user.id}][name: ${user.name}]`,
            'UpdateUserUseCase.execute',
        );

        return userUpdated.toJSON();
    }
}