import { PrismaClient, Category } from "@prisma/client"
export type CreateCategoryType = Pick<Category, "name" | "description">
export type UpdateCategoryType = Partial<Category>

const prisma = new PrismaClient()

export interface CategoryModelInteface {
  getById: (id: number) => Promise<Category | null>
  getAll: () => Promise<Category[]>
  create: (data: CreateCategoryType) => Promise<Category>
  delete: (id: number) => Promise<Category>
  update: (data: UpdateCategoryType) => Promise<Category>
  getByName: (name: string) => Promise<Category[]>
  getByDescription: (description: string) => Promise<Category[]>
}

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
    const category = await prisma.category.findMany({
      where: {
        name: {
          contains: name
        }
      }
    })

    return category
  }
  static getByDescription = async (description: string) => {
    const category = await prisma.category.findMany({
      where: {
        description: {
          contains: description
        }
      }
    })

    return category
  }
}
