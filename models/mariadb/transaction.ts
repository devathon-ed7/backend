import { PrismaClient } from "@prisma/client"
import { CreateTransactionType, UpdateTransactionType } from "../../interfaces"
import { updateById } from "../../utils/modelUtils"

const prisma = new PrismaClient()

export default class TransactionModel {
  static getAll = async () => {
    return await prisma.inventoryTransaction.findMany()
  }

  static getByProductId = async (id: number) => {
    return await prisma.inventoryTransaction.findMany({
      where: { product_id: id },
      orderBy: { created_at: "desc" }
    })
  }

  static getByCode = async (code: string) => {
    return await prisma.inventoryTransaction.findMany({
      where: { code: code },
      orderBy: { created_at: "desc" }
    })
  }

  static create = async (data: CreateTransactionType) => {
    return await prisma.inventoryTransaction.create({
      data
    })
  }

  static update = async (data: UpdateTransactionType) =>
    await updateById(prisma.inventoryTransaction, data, data.id as number)

  static delete = async (id: number) => {
    await prisma.inventoryTransaction.delete({
      where: {
        id
      }
    })
  }
}
