import { PrismaClient } from "@prisma/client"
import { CreateUserDetailsType, UpdateUserDetailsType } from "../../interfaces"

const prisma = new PrismaClient()
export default class DetailsModel {
  static getAll = async () => {
    const details = await prisma.user_details.findMany()
    return details
  }
  static getById = async (id: number) => {
    return await prisma.user_details.findUnique({
      where: {
        id
      }
    })
  }
  static create = async (data: CreateUserDetailsType) => {
    return await prisma.user_details.create({
      data
    })
  }
  static update = async (data: UpdateUserDetailsType) => {
    const details = await prisma.user_details.update({
      where: {
        id: data.id
      },
      data
    })
    return details
  }

  static delete = async (id: number) => {
    return await prisma.user_details.delete({
      where: {
        id
      }
    })
  }
}
