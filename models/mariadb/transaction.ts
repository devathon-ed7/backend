import {PrismaClient, InventoryTransaction } from "@prisma/client"

export interface TransactionDocument extends InventoryTransaction {}

export type CreateTransactionType = Pick<InventoryTransaction, "product_id" | "quantity" | "code" | "transaction_type">

export type UpdateTransactionType = Partial<InventoryTransaction>


export interface TransactionModelInterface {
  getAll: () => Promise<InventoryTransaction[]>
  getById: (id: number) => Promise<InventoryTransaction | null>
  create: (data: CreateTransactionType) => Promise<InventoryTransaction>
  update: (data: UpdateTransactionType) => Promise<InventoryTransaction>
  delete: (id: number) => Promise<void>
}

const prisma = new PrismaClient()

export default class TransactionModel implements TransactionModelInterface {
  getAll = async (): Promise<InventoryTransaction[]> => {
    return await prisma.inventoryTransaction.findMany()
  }

  getById = async (id: number): Promise<InventoryTransaction | null> => {
    return await prisma.inventoryTransaction.findUnique({
      where: {
        id
      }
    })
  }

  create = async (data: CreateTransactionType): Promise<InventoryTransaction> => {
    return await prisma.inventoryTransaction.create({
      data
    })
  }

  update = async (data: UpdateTransactionType): Promise<InventoryTransaction> => {
    return await prisma.inventoryTransaction.update({
      data,
      where: {
        id: data.id
      }
    })
  }

  delete = async (id: number): Promise<void> => {
    await prisma.inventoryTransaction.delete({
      where: {
        id
      }
    })
  }
}