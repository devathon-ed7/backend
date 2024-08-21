import { PrismaClient } from "@prisma/client"
import { omitFields } from "../../utils/middleware"
import { CreateUserType, UpdateUserType } from "../../interfaces"
import { findUnique } from "../../utils/modelUtils"

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

  static getById = async (id: number) =>
    await findUnique(
      prisma.user_accounts,
      { id },
      { user_details: { include: { role: true } } }
    )

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
  static getByUsername = async (username: string) =>
    await findUnique(
      prisma.user_accounts,
      { username },
      { user_details: { include: { role: true } } }
    )
}
