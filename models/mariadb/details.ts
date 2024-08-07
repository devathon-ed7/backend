import { PrismaClient, User_details } from "@prisma/client"

export type CreateDeatilType = Omit<User_details, "id">
export type UpdateDeatilType = Partial<User_details>
const prisma = new PrismaClient()

export interface DetailsModelInterface {
  getAll: () => Promise<User_details[]>
  getById: (id: number) => Promise<User_details | null>
  create: (data: CreateDeatilType) => Promise<User_details>
  update: (data: UpdateDeatilType) => Promise<User_details>
  delete: (id: number) => Promise<User_details>
}

export default class DetailsModel {
  static getAll = async () => {
    const details = await prisma.user_details.findMany()
    return details
  }
  static getById = async (id: number) => {
    const deatails = await prisma.user_details.findUnique({
      where: {
        id
      }
    })
    return deatails
  }
  static create = async (data: CreateDeatilType) => {
    const details = await prisma.user_details.create({
      data
    })

    return details
  }
  static update = async (data: UpdateDeatilType) => {
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
