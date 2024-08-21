import { PrismaClient, Category } from "@prisma/client"
import { findMany } from "../../utils/modelUtils"
export type CreateCategoryType = Pick<Category, "name" | "description">
export type UpdateCategoryType = Partial<Category>

const prisma = new PrismaClient()

export default class CategoryModel {
  static getById = async (id: number) => {
    const category = await prisma.category.findUnique({
      where: {
        id
      }
    })
    return category
  }
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

  static getByName = async (name: string) => await findMany("name", name)

  static getByDescription = async (description: string) =>
    await findMany("description", description)
}
