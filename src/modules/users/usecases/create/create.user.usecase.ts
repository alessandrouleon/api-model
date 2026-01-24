import { HashService } from "@/@shared/services/hash.service";
import { IdService } from "@/@shared/services/id.service";
import { UserRepositoryInterface } from "@/modules/users/repository/user.repository.interface";
import { InputCreateUserUseCaseDto, OutputCreateUserUseCaseDto } from "@/modules/users/usecases/create/create.user.usecase.dto";
import { BadRequestException, Inject, Injectable, Logger } from "@nestjs/common";
import { log } from "console";
import UserFactory from "../../factory/user.factory";


@Injectable()
export class CreateUserUseCase {
   constructor(
      @Inject('UserRepositoryInterface')
      private readonly userRepository: UserRepositoryInterface,
      private readonly idService: IdService,
      private readonly hashService: HashService
   ) { }

   async execute(input: InputCreateUserUseCaseDto): Promise<OutputCreateUserUseCaseDto> {

      const [username, email] = await Promise.all([
         this.userRepository.findByUsername(input.username),
         this.userRepository.findByEmail(input.email)

      ]);

      if (username) {
         if (username.username === input.username) {
            throw new BadRequestException('User already registered with this username');
         }
      }

      if (email) {
         if (email.email === input.email) {
            throw new BadRequestException('User already registered with this email');
         }
      }

      const user = UserFactory.createUserFactory({
         id: this.idService.generate(),
         name: input.name,
         username: input.username,
         email: input.email,
         password: input.password,
         roles: input.roles
      });

      user.password = await this.hashService.hash(user.password);
      const userCreated = await this.userRepository.create(user);
      log(userCreated);
      Logger.log(
         `User created. [ID: ${user.id}][name: ${user.name}]`,
         'CreateUserUseCase.execute',
      );

      return userCreated.toJSON();
   }
}