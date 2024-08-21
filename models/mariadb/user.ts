import { PrismaClient, User_accounts } from "@prisma/client"
import { omitFields } from "../../utils/middleware"
import { CreateUserType, UpdateUserType } from "../../interfaces"

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

  static async getById(id: number) {
    const user = await this.findUser({ id })
    return user || null
  }

  static create = async (user: CreateUserType) =>
    await prisma.user_accounts.create({
      data: user
    })

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
  static async getByUsername(username: string) {
    const user = await this.findUser({ username })
    return user || null
  }

  private static async findUser(where: {
    id?: number
    username?: string
  }): Promise<User_accounts | null> {
    if (!where.id && !where.username) {
      throw new Error("You must provide an id or a username.")
    }

    const whereClause: { id?: number; username?: string } = {}

    if (where.id !== undefined) {
      whereClause.id = where.id
    }

    if (where.username !== undefined) {
      whereClause.username = where.username
    }

    return await prisma.user_accounts.findUnique({
      where: whereClause as { id: number } | { username: string },
      include: {
        user_details: {
          include: {
            role: true
          }
        }
      }
    })
  }
}
