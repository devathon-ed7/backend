import { PrismaClient } from "@prisma/client"
import { CreateTransactionType, SortOrder, UpdateTransactionType } from "../interfaces"


const prisma = new PrismaClient()

export default class TransactionModel {

  static getAll = async (
    page: number = 1,
    limit: number = 10,
    sortBy: string = "id",
    order: SortOrder = "asc"
  ) => {
    const transactions = await prisma.inventoryTransaction.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        [sortBy]: order
      }
    });
    return transactions
  }

  static getById = async (id: string) => {
    return await prisma.inventoryTransaction.findUnique({
      where: {
        id,
      }
    });
  }

  static getByProductId = async (id: string) => {
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

  static update = async (data: UpdateTransactionType) => {
    return await prisma.inventoryTransaction.update({
      data,
      where: { id: data.id }
    });
  }

  static delete = async (id: string) => {
    await prisma.inventoryTransaction.delete({
      where: {
        id
      }
    })
  }
  static count = async () => await prisma.inventoryTransaction.count();
}
