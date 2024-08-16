import {PrismaClient, InventoryTransaction } from "@prisma/client"

export interface TransactionDocument extends InventoryTransaction {}

export type CreateTransactionType = Pick<InventoryTransaction, "product_id" | "quantity" | "code" | "transaction_type">

export type UpdateTransactionType = Partial<InventoryTransaction>


export interface TransactionModelInterface {
  getAll () : Promise<TransactionDocument[]>
  getByProductId (id: number) : Promise<TransactionDocument[] | null>
  getByCode(code: string): Promise<TransactionDocument[] | null>
  create (data: CreateTransactionType): Promise<TransactionDocument>
  update(data: UpdateTransactionType): Promise<TransactionDocument>
  delete(id: number) : Promise<void>
}

const prisma = new PrismaClient()

export default class TransactionModel  {
  static getAll = async (): Promise<InventoryTransaction[]> => {
    return await prisma.inventoryTransaction.findMany()
  }

  static getByProductId = async (id: number): Promise<InventoryTransaction[] | null> => {
    return await prisma.inventoryTransaction.findMany({
      where: { product_id: id },
      orderBy: { created_at: 'desc' },
    })
  }

  static getByCode = async (code: string): Promise<InventoryTransaction[] | null> => {
    return await prisma.inventoryTransaction.findMany({
      where: { code: code },
      orderBy: { created_at: 'desc' },
    })
  }

  static create = async (data: CreateTransactionType): Promise<InventoryTransaction> => {
    return await prisma.inventoryTransaction.create({
      data
    })
  }

  static update = async (data: UpdateTransactionType): Promise<InventoryTransaction> => {
    return await prisma.inventoryTransaction.update({
      data,
      where: {
        id: data.id
      }
    })
  }

  static delete = async (id: number): Promise<void> => {
    await prisma.inventoryTransaction.delete({
      where: {
        id
      }
    })
  }
}