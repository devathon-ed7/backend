import { PrismaClient, User_details } from "@prisma/client"

export interface UserDetailsDocument extends User_details {}
export type CreateUserDetailsType = Pick<
  User_details,
  | "description"
  | "notes"
  | "role_id"
  | "email"
  | "name"
  | "user_account_id"
  | "profile_filename"
>
export type UpdateUserDetailsType = Partial<User_details>

export interface DetailsModelInterface {
  getAll: () => Promise<User_details[]>
  getById: (id: number) => Promise<User_details | null>
  create: (data: CreateUserDetailsType) => Promise<User_details>
  update: (data: UpdateUserDetailsType) => Promise<User_details>
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
