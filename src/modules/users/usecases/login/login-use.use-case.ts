import { UserEntity } from '@/modules/users/domain/entities/user.entity';
import { UserRepositoryInterface } from '@/modules/users/repository/user.repository.interface';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';

@Injectable()
export class LoginUserUseCase {
    constructor(
        @Inject('UserRepositoryInterface')
        private readonly userRepository: UserRepositoryInterface
    ) { }

    async authUsername(username: string): Promise<UserEntity> {
        const existUser = await this.userRepository.findByUsername(username);

        if (!existUser) {
            throw new BadRequestException(`User with username ${username} not found`);
        }

        if (!existUser.isActive) {
            throw new BadRequestException(`User with username ${username} is not active`);
        }
        return existUser;
    }
}
