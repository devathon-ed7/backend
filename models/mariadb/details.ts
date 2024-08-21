import { PrismaClient } from "@prisma/client"
import { CreateUserDetailsType, UpdateUserDetailsType } from "../../interfaces"
import { findUnique, updateById } from "../../utils/modelUtils"

const prisma = new PrismaClient()
export default class DetailsModel {
  static getAll = async () => await prisma.user_details.findMany()

  static getById = async (id: number) =>
    await findUnique(prisma.user_details, { id })

  static create = async (data: CreateUserDetailsType) =>
    await prisma.user_details.create({
      data
    })

  static update = async (data: UpdateUserDetailsType) =>
    await updateById(prisma.user_details, data, data.id as number)

  static delete = async (id: number) =>
    await prisma.user_details.delete({
      where: {
        id
      }
    })
}
