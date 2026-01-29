
import Entity from "@/@shared/domain/entity/entity.abstract";
import NotificationErros from "@/@shared/domain/notification/notification.error";
import { ROLES } from "@/modules/auth/enums/roles.enum";
import { UserValidatorFactory } from "../../factory/user.validator.factory";

export type UserIterfaces = {
  id?: string;
  name: string;
  username: string;
  email: string;
  password?: string;
  roles: ROLES[];
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export type UserToJSON = {
  id: string;
  name: string;
  username: string;
  email: string;
  roles: ROLES[];
  password?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
export class UserEntity extends Entity {
  private _name: string;
  private _username: string;
  private _email: string;
  private _password: string;
  private _roles: ROLES[];
  private _isActive?: boolean;


  constructor(
    private readonly props: UserIterfaces
  ) {
    super(props.id, props.createdAt, props.updatedAt, props.deletedAt);

    this._name = props.name;
    this._username = props.username;
    this._email = props.email;
    this._password = props.password;
    this._roles = props.roles
    this._isActive = props.isActive ?? true;

    this.validate();

    if (this.notifications.hasErrors()) {
      throw new NotificationErros(this.notifications.getErrors());
    }
  }

  validate(): void {
    UserValidatorFactory.create().validate(this);
  }

  get name() {
    return this._name;
  }
  get username() {
    return this._username;
  }
  get email() {
    return this._email;
  }
  get password() {
    return this._password;
  }
  get roles() {
    return this._roles;
  }

  set name(value: string) {
    this._name = value.trim();
    this.validate();
  }
  set username(value: string) {
    this._username = value.trim();
    this.validate();
  }
  set email(value: string) {
    this._email = value.trim();
    this.validate();
  }
  set password(value: string) {
    this._password = value.trim();
    this.validate();
  }
  set roles(value: ROLES[]) {
    if (!value || value.length === 0) {
      throw new NotificationErros([
        {
          context: 'user',
          message: 'Roles are required',
        },
      ]);
    }
    this._roles = value;
    this.validate();
  }
  set isActive(value: boolean) {
    this._isActive = value;
  }
  get isActive() {
    return this._isActive;
  }

  toJSON(): UserToJSON {
    return {
      id: this.id,
      name: this.name,
      username: this.username,
      email: this.email,
      roles: this.roles,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt
    };
  }

}