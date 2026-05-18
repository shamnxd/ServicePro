import { injectable } from "tsyringe";
import { BaseRepository } from "./BaseRepository";
import { IUserRepository } from "../../interfaces/repositories/IUserRepository";
import { IUser } from "../../interfaces/models/IUser";
import { UserModel, IUserDocument } from "../../models/User";

@injectable()
export class UserRepository extends BaseRepository<IUserDocument, IUser> implements IUserRepository {
  constructor() {
    super(UserModel);
  }

  protected toDomain(userDoc: IUserDocument): IUser {
    return {
      id: userDoc._id.toString(),
      username: userDoc.username,
      email: userDoc.email,
      passwordHash: userDoc.passwordHash,
      refreshToken: userDoc.refreshToken,
      createdAt: userDoc.createdAt,
      updatedAt: userDoc.updatedAt
    };
  }

  public async findByEmail(email: string): Promise<IUser | null> {
    const userDoc = await UserModel.findOne({ email }).exec();
    return userDoc ? this.toDomain(userDoc) : null;
  }

  public async updateRefreshToken(id: string, token: string | null): Promise<void> {
    await UserModel.findByIdAndUpdate(id, { refreshToken: token }).exec();
  }
}
