import { InventoryTransaction } from "@prisma/client"

export interface TransactionDocument extends InventoryTransaction {}
export type CreateTransactionType = Pick<
  InventoryTransaction,
  "product_id" | "quantity" | "code" | "transaction_type"
>
export type UpdateTransactionType = Partial<InventoryTransaction>
export interface TransactionModelInterface {
  getAll(): Promise<TransactionDocument[]>
  getById(id: number): Promise<TransactionDocument | null>
  getByProductId(id: number): Promise<TransactionDocument[] | null>
  getByCode(code: string): Promise<TransactionDocument[] | null>
  create(data: CreateTransactionType): Promise<TransactionDocument>
  update(data: UpdateTransactionType): Promise<TransactionDocument>
  delete(id: number): Promise<void>
}
