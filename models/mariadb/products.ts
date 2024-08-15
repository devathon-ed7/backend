import { PrismaClient, Product } from "@prisma/client"

export interface ProductDocument extends Product {}
export type CreateProductType = Pick<
  Product,
  | "name"
  | "description"
  | "stock"
  | "price"
  | "notes"
  | "category_id"
  | "supplier_id"
  | "images"
>
export type UpdateProductType = Partial<Product>

export interface ProductModelInterface {
  getAll: () => Promise<ProductDocument[]>
  getById: (id: number) => Promise<ProductDocument | null>
  getByIdWithRelations: (id: number) => Promise<ProductDocument | null>
  getAllWithRelations: () => Promise<ProductDocument[] | null>
  create: (data: CreateProductType) => Promise<ProductDocument>
  update: (data: UpdateProductType) => Promise<ProductDocument>
  delete: (id: number) => Promise<ProductDocument>
}

const prisma = new PrismaClient()
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
