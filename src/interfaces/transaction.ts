import { InventoryTransaction } from "@prisma/client"
import { SortOrder } from "./pagination"

export interface TransactionDocument extends InventoryTransaction { }
export type CreateTransactionType = Pick<
  InventoryTransaction,
  "product_id" | "quantity" | "code" | "transaction_type"
>
export type UpdateTransactionType = Partial<InventoryTransaction>
export interface TransactionModelInterface {
  getAll(
    page: number,
    limit: number,
    sortBy: string,
    order: SortOrder
  ): Promise<TransactionDocument[]>
  getById(id: string): Promise<TransactionDocument | null>
  getByProductId(id: string): Promise<TransactionDocument[] | null>
  getByCode(code: string): Promise<TransactionDocument[] | null>
  create(data: CreateTransactionType): Promise<TransactionDocument>
  update(data: UpdateTransactionType): Promise<TransactionDocument>
  delete(id: string): Promise<void>
  count(): Promise<number>
}
