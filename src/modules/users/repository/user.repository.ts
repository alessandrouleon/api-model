import { FindFilterInterface, PaginationResultInterface } from "@/@shared/repository/repository.interface";
import { UserEntity } from "@/modules/users/domain/entities/user.entity";
import { User, UserDocument } from "@/modules/users/models/user.model";
import { UserRepositoryInterface } from "@/modules/users/repository/user.repository.interface";
import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";

@Injectable()
export class UserRepository implements UserRepositoryInterface {

  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) { }

  async create(entity: UserEntity): Promise<UserEntity> {
    const userModel = this.entityToModel(entity);
    const saveUser = await this.userModel.create(userModel);

    if (!saveUser) {
      Logger.warn(`User creation failed`, 'UserRepository.create');
    }

    return this.modelToEntity(saveUser);
  }

  async update(entity: UserEntity): Promise<UserEntity> {
    const objId = new Types.ObjectId(entity.id);
    const originalDoc = await this.userModel
      .findOne({
        _id: objId,
        $or: [
          { deletedAt: { $exists: false } },
          { deletedAt: null },
        ],
      })
      .setOptions?.({ autopopulate: false })
      .lean();

    if (!originalDoc) {
      throw new NotFoundException(`User ${entity.id} not found`);
    }

    const updatePayload = this.entityToModel(entity);

    if ((originalDoc as any)._id)
      (originalDoc as any)._id = String((originalDoc as any)._id);
    if ((originalDoc as any).__v !== undefined) delete (originalDoc as any).__v;


    const updatedDoc = await this.userModel.findOneAndUpdate(
      { _id: objId },
      { $set: updatePayload },
      {
        new: true,
        runValidators: true,
        strict: true,
        writeConcern: { w: 'majority', wtimeout: 5000 },
      },
    );

    if (!updatedDoc) {
      Logger.warn(`Failed at update user ${entity.id}`, 'UserRepository.update');
      throw new NotFoundException('User not found');
    }

    const updatedSnap = updatedDoc.toObject();
    if ((updatedSnap as any)._id)
      (updatedSnap as any)._id = String((updatedSnap as any)._id);
    if ((updatedSnap as any).__v !== undefined) delete (updatedSnap as any).__v;

    return this.modelToEntity(updatedDoc);
  }

  async delete(_id: string): Promise<UserEntity> {
    const objId = new Types.ObjectId(_id);

    const deleted = await this.userModel
      .findOneAndUpdate(
        { _id: objId },
        { $set: { deletedAt: new Date() } },
        {
          new: true,
          strict: true,
          runValidators: true,
        }
      )
      .setOptions?.({ autopopulate: false });

    if (!deleted) {
      Logger.warn(`Failed at delete user ${_id}`, 'UserRepository.delete');
      throw new NotFoundException(`User ${_id} not found`);
    }

    const originalSnap = deleted.toObject();

    if (originalSnap?._id) {
      originalSnap._id = originalSnap._id;
    }

    return this.modelToEntity(deleted);
  }

  async findOneById(id: string): Promise<UserEntity> {
    const user = await this.userModel.findOne({
      _id: new Types.ObjectId(id), $or: [
        { deletedAt: { $exists: false } },
        { deletedAt: null },
      ]
    }).exec();
    if (!user) return null;

    return this.modelToEntity(user);
  }

  async findByUsername(username: string): Promise<UserEntity | null> {
    const user = await this.userModel.findOne({ username }).exec();
    if (!user) return null;
    return this.modelToEntity(user);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) return null;
    return this.modelToEntity(user);
  }

  async find(query: FindFilterInterface): Promise<PaginationResultInterface<UserEntity>> {
    const {
      filter = {},
      order = "desc",
      orderby = "createdAt",
      limit = 25,
      page = 1,
      skip = (page - 1) * limit,
    } = query;

    const queryBuild = {};
    const $or = [];

    if (filter.name) {
      $or.push({ name: { $regex: filter.name, $options: 'i' } });
    } else if (filter.search) {
      $or.push({ name: { $regex: filter.search, $options: 'i' } });
    }

    if (filter.username) {
      $or.push({ username: { $regex: filter.username, $options: 'i' } });
    } else if (filter.search) {
      $or.push({ username: { $regex: filter.search, $options: 'i' } });
    }

    if (filter.email) {
      $or.push({ email: { $regex: filter.email, $options: 'i' } });
    } else if (filter.search) {
      $or.push({ email: { $regex: filter.search, $options: 'i' } });
    }

    if (filter.roles) {
      $or.push({ roles: { $regex: filter.roles, $options: 'i' } });
    } else if (filter.search) {
      $or.push({ roles: { $regex: filter.search, $options: 'i' } });
    }

    $or.push(
      { deletedAt: { $exists: false } },
      { deletedAt: null },
    );

    if ($or.length > 0) {
      queryBuild['$or'] = $or;
    }

    const total = await this.userModel.countDocuments(queryBuild).exec();
    const totalPages = Math.ceil(total / limit);

    const findQuery = this.userModel
      .find(queryBuild)
      .sort({ [orderby]: order === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const users = await findQuery.exec();

    return {
      result: users.map((user) => this.modelToEntity(user)),
      pagination: {
        page: Number(page),
        totalPages,
        size: limit,
        total,
      }
    }
  }

  private modelToEntity(userModel: User): UserEntity {
    const userEntity = new UserEntity(
      {
        id: userModel._id.toString(),
        name: userModel.name,
        username: userModel.username,
        email: userModel.email,
        password: userModel.password,
        roles: userModel.roles,
        createdAt: userModel.createdAt,
        updatedAt: userModel.updatedAt,
        deletedAt: userModel.deletedAt
      }
    );

    return userEntity;
  }

  private entityToModel(entity: UserEntity): User {
    const userModel = new this.userModel({
      _id: new Types.ObjectId(entity.id),
      name: entity.name,
      username: entity.username,
      email: entity.email,
      password: entity.password,
      roles: entity.roles,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    });

    return userModel;
  }


}