import ValidatorInterface from "@/@shared/domain/validator/validator.interface";
import { UserEntity } from "@/modules/users/domain/entities/user.entity";
import { UserJoiValidator } from "@/modules/users/domain/validator/user.validator";

export class UserValidatorFactory {
  static create(): ValidatorInterface<UserEntity> {
    return new UserJoiValidator();
  }
}