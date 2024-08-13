import { PrismaClient, Product } from "@prisma/client"

const prisma = new PrismaClient()

export type CreateProductType = Omit<
  Product,
  "id" | "created_at" | "updated_at" | "supplier" | "category" | "sold"
>
export type UpdateProductType = Partial<Product>

export interface ProductModelInterface {
  getAll: () => Promise<Product[]>
  getById: (id: number) => Promise<Product>
  getByIdWithRelations: (id: number) => Promise<Product>
  getAllWithRelations: () => Promise<Product>
  create: (data: CreateProductType) => Promise<Product>
  update: (data: UpdateProductType) => Promise<Product>
  delete: (id: number) => Promise<Product>
}

export default class ProductModel {
  static getAll = async () => await prisma.product.findMany()
  static getById = async (id: number) =>
    await prisma.product.findUnique({ where: { id } })
  static delete = async (id: number) =>
    await prisma.product.delete({ where: { id } })
  static create = async (data: CreateProductType) =>
    await prisma.product.create({ data })
  static update = async (data: UpdateProductType) =>
    await prisma.product.update({ where: { id: data.id }, data })
  static getAllWithRelations = async () =>
    await prisma.product.findMany({
      include: {
        category: true,
        supplier: true
      }
    })
  static getByIdWithRelations = async (id: number) =>
    await prisma.product.findUnique({
      where: { id },
      include: {
        supplier: true,
        category: true
      }
    })
}
