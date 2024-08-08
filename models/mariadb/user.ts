import { PrismaClient, User_accounts } from "@prisma/client"
import { omitFields } from "../../utils/middleware"

export interface UserDocument extends User_accounts {}
export type CreateUserType = Pick<User_accounts, "username" | "password">
export type UpdateUserType = Partial<User_accounts>

export interface UserModelInterface {
  getAll: () => Promise<Partial<UserDocument>[]>
  getById: (id: number) => Promise<UserDocument | null>
  create: (user: CreateUserType) => Promise<UserDocument>
  update: (user: UpdateUserType) => Promise<UserDocument>
  delete: (id: number) => Promise<UserDocument>
  getByUsername: (username: string) => Promise<UserDocument | null>
}

const prisma = new PrismaClient()
export default class UserModel {
  static getAll = async () => {
    const users = await prisma.user_accounts.findMany({
      include: {
        user_details: {
          include: {
            role: true
          }
        }
      }
    })
    const usersWithoutPassword = users.map((user) =>
      omitFields(user, ["password"])
    )
    return usersWithoutPassword
  }

  static getById = async (id: number) => {
    const user = await prisma.user_accounts.findUnique({
      where: {
        id
      }
    })
    return user
  }

  static create = async (user: CreateUserType) => {
    const createdUser = await prisma.user_accounts.create({
      data: user
    })
    return createdUser
  }

  static update = async (user: UpdateUserType) => {
    const updatedUser = await prisma.user_accounts.update({
      data: user,
      where: {
        id: user.id
      }
    })
    return updatedUser
  }
  static delete = async (id: number) => {
    const deletedUser = await prisma.user_accounts.delete({
      where: {
        id
      }
    })
    return deletedUser
  }
  static getByUsername = async (username: string) => {
    const user = await prisma.user_accounts.findUnique({
      where: {
        username
      },
      include: {
        user_details: {
          include: {
            role: true
          }
        }
      }
    })
    return user || null
  }
}
