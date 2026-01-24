import { HashService } from "@/@shared/services/hash.service";
import { IdService } from "@/@shared/services/id.service";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserController } from "./controllers/user.controller";
import { UserFacade } from "./facade/user.facade";
import { User, UserSchema } from "./models/user.model";
import { UserRepository } from "./repository/user.repository";
import { CreateUserUseCase } from "./usecases/create/create.user.usecase";
import { DeleteUserUseCase } from "./usecases/delete/delete.user.usecase";
import { FindAllUserUseCase } from "./usecases/findAll/find-all.user.usecase";
import { FindByIdUserUseCase } from "./usecases/findById/findById.user.usecase";
import { LoginUserUseCase } from "./usecases/login/login-use.use-case";
import { UpdateUserUseCase } from "./usecases/update/update.user.usecase";

@Module({
    imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
    controllers: [UserController],
    providers: [
        //Facade
        UserFacade,

        //Services
        IdService,
        HashService,

        //Repositories
        {
            provide: 'UserRepositoryInterface',
            useClass: UserRepository,
        },

        //UseCases
        CreateUserUseCase,
        UpdateUserUseCase,
        FindByIdUserUseCase,
        FindAllUserUseCase,
        DeleteUserUseCase,
        LoginUserUseCase
    ],
    exports: [LoginUserUseCase]
})

export class UserModule { }