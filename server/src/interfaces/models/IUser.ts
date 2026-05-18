export interface IUser {
  id?: string;
  username: string;
  email: string;
  passwordHash: string;
  refreshToken?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}
