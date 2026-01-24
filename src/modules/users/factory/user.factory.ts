import { UserEntity, UserIterfaces } from "../domain/entities/user.entity";

export default class UserFactory {
    public static createUserFactory(props: UserIterfaces): UserEntity {
        return new UserEntity(props);
    }
}