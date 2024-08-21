import { PrismaClient } from "@prisma/client"
import { findMany, findUnique } from "../../utils/modelUtils"
import { CreateCategoryType, UpdateCategoryType } from "../../interfaces"

const prisma = new PrismaClient()

export default class CategoryModel {
  static getById = async (id: number) =>
    await findUnique(prisma.category, { id })
  static getAll = async () => await prisma.category.findMany()
  static create = async (data: CreateCategoryType) =>
    await prisma.category.create({ data })
  static delete = async (id: number) =>
    await prisma.category.delete({
      where: {
        id
      }
    })

  static update = async (data: UpdateCategoryType) =>
    await prisma.category.update({
      data,
      where: {
        id: data.id
      }
    })

  static getByName = async (name: string) =>
    await findMany(prisma.category, "name", name)

  static getByDescription = async (description: string) =>
    await findMany(prisma.category, "description", description)
}
