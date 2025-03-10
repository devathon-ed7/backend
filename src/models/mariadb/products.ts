import { PrismaClient } from "@prisma/client"
import { CreateProductType, UpdateProductType } from "../../interfaces"
import { findUnique, updateById } from "../../utils/modelUtils"

const prisma = new PrismaClient()
export default class ProductModel {
  static getAll = async () => await prisma.product.findMany()

  static getById = async (id: number) =>
    await findUnique(prisma.product, { id })

  static delete = async (id: number) =>
    await prisma.product.delete({ where: { id } })

  static create = async (data: CreateProductType) =>
    await prisma.product.create({ data })

  static update = async (data: UpdateProductType) =>
    await updateById(prisma.product, data, data.id as number)

  static getByPage = async ({ skip, take }: { skip: number; take: number }) =>
    await prisma.product.findMany({ skip, take })

  static getAllWithRelations = async () =>
    await prisma.product.findMany({
      include: {
        category: true,
        supplier: true
      }
    })

  static getByIdWithRelations = async (id: number) =>
    await findUnique(prisma.product, { id }, { category: true, supplier: true })
}
