//import ValidatorInterface from '@/@shared/domain/validator/validator.interface';
import { Notification } from "../notification/notification";

export default abstract class Entity {
  private self: any;
  private _updatedAt: Date;
  private _deletedAt?: Date;
  protected notifications: Notification

  constructor(
    public readonly id: string,
    // public readonly validator: ValidatorInterface,
    public readonly createdAt?: Date,
    updatedAt?: Date,
    deletedAt?: Date,
  ) {
    if (!createdAt) {
      this.createdAt = new Date();
      this._updatedAt = new Date();
    } else {
      this._updatedAt = updatedAt;
      this._deletedAt = deletedAt;
    }

    this.notifications = new Notification();

    // this.self = this;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  set updatedAt(value: Date) {
    this._updatedAt = value;
  }

  setUpdatedAt(value?: Date) {
    if (value) this._updatedAt = new Date(value);
    else this._updatedAt = new Date();
  }

  get deletedAt(): Date {
    return this._deletedAt;
  }

  set deletedAt(value: Date) {
    this._deletedAt = value;
  }

  setDeletedAt(value?: Date) {
    if (value) this._deletedAt = new Date(value);
    else this._deletedAt = new Date();
  }

  // validate() {
  //   this.validator.validate(this.self);
  // }

  get notification(): Notification {
    return this.notifications;
  }
}
