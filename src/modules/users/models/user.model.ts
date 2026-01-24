import { ROLES } from '@/modules/auth/enums/roles.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {

  @Prop({ type: Types.ObjectId, default: () => new Types.ObjectId() })
  _id: Types.ObjectId;

  @Prop({
    type: String,
    required: true,
    trim: true,
  })
  name: string;

  @Prop({ type: String, required: false, unique: true, trim: true })
  username: string;

  @Prop({ type: String, required: false, unique: true, trim: true })
  email?: string;

  @Prop({ type: String, required: false, trim: true })
  password: string;

  @Prop({
    type: [String],
    enum: Object.values(ROLES),
    default: [ROLES.USER]
  })
  roles?: ROLES[];

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: null })
  updatedAt?: Date;

  @Prop({ type: Date, default: null })
  deletedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
