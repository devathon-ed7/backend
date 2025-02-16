import { PrismaClient } from "@prisma/client"
import { omitFields } from "../../utils/middleware"
import { CreateUserType, UpdateUserType } from "../../interfaces"
import { findUnique, updateById } from "../../utils/modelUtils"

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

  static update = async (user: UpdateUserType) =>
    await updateById(prisma.user_accounts, user, user.id as number)

  static delete = async (id: number) =>
    await prisma.user_accounts.delete({
      where: {
        id
      }
    })

  static getByUsername = async (username: string) =>
    await prisma.user_accounts.findUnique({
      where: { username },
      include: {
        user_details: {
          include: {
            role: true
          }
        }
      }
    })
}
