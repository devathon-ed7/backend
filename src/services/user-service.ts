import { Singleton } from "typescript-ioc";
import { SortOrder, UserCreateType, UserDocument, UserDocumentWithoutPassword, UserUpdateType } from "../interfaces";
import UserModel from "../models/user-model";

@Singleton
export class UserService {


  public getAll = async (page: number, limit: number, sortBy: string, order: SortOrder): Promise<[UserDocumentWithoutPassword[], number]> => {
    const users = await UserModel.getAll(page, limit, sortBy, order);
    const totalUsers = await UserModel.count();
    return [users, totalUsers]
  }

  public getById = async (id: string): Promise<UserDocumentWithoutPassword | null> => {
    return UserModel.getById(id);
  }

  public getByEmail = async (email: string): Promise<UserDocumentWithoutPassword | null> => {
    return UserModel.getByEmail(email)
  }

  public create = async (user: UserCreateType): Promise<UserDocument> => {
    return UserModel.create(user)
  }

  public update = async (id: string, user: UserUpdateType): Promise<UserDocument> => {
    return UserModel.update(id, user)
  }

  public delete = async (id: string): Promise<UserDocumentWithoutPassword> => {
    return UserModel.delete(id)
  }

  public emailExists = async (email: string): Promise<boolean> => {
    const existingUser = await UserModel.getByEmail(email);
    return !!existingUser;
  };
}