import { PrismaClient, User_details } from "@prisma/client"

export interface DetailsDocument extends User_details {}
export type CreateDetailType = Pick<
  User_details,
  | "description"
  | "notes"
  | "role_id"
  | "email"
  | "name"
  | "user_account_id"
  | "profile_filename"
>
export type UpdateDetailType = Partial<User_details>

export interface DetailsModelInterface {
  getAll: () => Promise<User_details[]>
  getById: (id: number) => Promise<User_details | null>
  create: (data: CreateDetailType) => Promise<User_details>
  update: (data: UpdateDetailType) => Promise<User_details>
  delete: (id: number) => Promise<User_details>
}

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
  static create = async (data: CreateDetailType) => {
    return await prisma.user_details.create({
      data
    })
  }
  static update = async (data: UpdateDetailType) => {
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
