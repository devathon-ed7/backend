import { PrismaClient, Category } from "@prisma/client"
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
  static getAll = async () => {
    const category = await prisma.category.findMany()
    return category
  }
  static create = async (data: CreateCategoryType) => {
    const category = await prisma.category.create({
      data
    })
    return category
  }
  static delete = async (id: number) => {
    const category = await prisma.category.delete({
      where: {
        id
      }
    })
    return category
  }
  static update = async (data: UpdateCategoryType) => {
    const category = await prisma.category.update({
      data,
      where: {
        id: data.id
      }
    })
    return category
  }
  static getByName = async (name: string) => {
    return await this.findCategories("name", name)
  }

  static getByDescription = async (description: string) => {
    return await this.findCategories("description", description)
  }

  private static async findCategories(field: string, value: string) {
    return await prisma.category.findMany({
      where: {
        [field]: {
          contains: value
        }
      }
    })
  }
}
