import { User } from "@prisma/client"
import { SortOrder } from "./pagination"

export interface UserDocument extends User { }

export type CreateUserType = Pick<
  User,
  "email" | "password" | "name"
>
export type UpdateUserType = Partial<User>

export type UserDocumentWithoutPassword = Omit<UserDocument, "password">
export interface UserModelInterface {
  getAll: (
    page: number,
    limit: number,
    sortBy: string,
    order: SortOrder
  ) => Promise<Partial<UserDocumentWithoutPassword>[]>
  getById: (id: string) => Promise<UserDocumentWithoutPassword | null>
  create: (user: CreateUserType) => Promise<UserDocument>
  update: (user: UpdateUserType) => Promise<UserDocument>
  delete: (id: string) => Promise<UserDocument>
  count: () => Promise<number>
  getByEmail: (email: string) => Promise<UserDocument | null>
}
