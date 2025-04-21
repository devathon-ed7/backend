import { User } from "@prisma/client"
import { SortOrder } from "./pagination"

export interface UserDocument extends User { }

export type UserCreateType = Pick<
  User,
  "email" | "password" | "name"
>
export type UserUpdateType = Partial<User>

export type UserDocumentWithoutPassword = Partial<Omit<UserDocument, "password">>
export interface UserModelInterface {
  getAll: (
    page: number,
    limit: number,
    sortBy: string,
    order: SortOrder
  ) => Promise<UserDocumentWithoutPassword[]>
  getById: (id: string) => Promise<UserDocumentWithoutPassword | null>
  create: (user: UserCreateType) => Promise<UserDocument>
  update: (id: string, user: UserUpdateType) => Promise<UserDocument>
  delete: (id: string) => Promise<UserDocument>
  count: () => Promise<number>
  getByEmail: (email: string) => Promise<UserDocument | null>
}
