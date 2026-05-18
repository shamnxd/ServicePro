import { Schema, model, Document } from "mongoose";
import { IUser } from "../interfaces/models/IUser";

export interface IUserDocument extends Document, Omit<IUser, "id"> {
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUserDocument>(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    passwordHash: { type: String, required: true },
    refreshToken: { type: String, default: null }
  },
  { timestamps: true }
);

export const UserModel = model<IUserDocument>("User", userSchema);
