import { type NextFunction, type Request, type Response } from "express"
import { CreateTransactionType, TransactionModelInterface } from "../interfaces"
import boom from "@hapi/boom"
import { deleteEntity, getAllEntities } from "../utils/controllerUtils"

interface transactionRequest {
  product_id: number
  quantity: number
  code: string
  transaction_type: transaction_type
}

type transaction_type = "in" | "out"

export class TransactionController {
  private transactionModel: TransactionModelInterface
  constructor({
    transactionModel
  }: {
    transactionModel: TransactionModelInterface
  }) {
    this.transactionModel = transactionModel
  }

  getAll = async (_req: Request, res: Response, next: NextFunction) =>
    await getAllEntities(_req, res, next, this.transactionModel, "transactions")

  getByProudctId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = this.extractProductId(req)
      const transactions = await this.fetchTransactionsByProductId(id)
      res.status(200).json({ transactions: transactions })
    } catch (error) {
      next(error)
    }
  }
  // get transactions by code
  getByCode = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const code = this.extractCode(req)
      const transactions = await this.fetchTransactionsByCode(code)
      res.status(200).json({ transactions: transactions })
    } catch (error) {
      next(error)
    }
  }
  //create transaction
  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { transaction } = req.body
      const transactions = await this.createTransaction(transaction)
      res.status(201).json({ transactions: transactions })
    } catch (error) {
      next(error)
    }
  }
  //update transaction
  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { transaction } = req.body
      const transactions = await this.updateTransaction(transaction)
      res.status(200).json({ transactions: transactions })
    } catch (error) {
      next(error)
    }
  }
  //delete transaction
  delete = async (req: Request, res: Response, next: NextFunction) =>
    deleteEntity(req, res, next, this.transactionModel, "transaction")

  /**
   *  Extract the product id from the request
   * @param request
   * @returns  number
   */
  private extractProductId(req: Request): number {
    const id = parseInt(req.params.id)
    if (isNaN(id)) {
      throw boom.badRequest("Id product is missing")
    }
    return id
  }

  /**
   *  Fetch the transactions by product id
   * @param id
   * @returns   Promise<InventoryTransaction[]>
   */
  private async fetchTransactionsByProductId(id: number) {
    const transactions = await this.transactionModel.getByProductId(id)
    if (!transactions) {
      throw boom.notFound("Transaction not found")
    }
    return transactions
  }

  /**
   *  Extract the code from the request
   * @param request
   * @returns string
   */
  private extractCode(req: Request): string {
    const code = req.params.code
    if (!code) {
      throw boom.badRequest("Code is missing")
    }
    return code
  }

  /**
   *  Fetch the transactions by code
   * @param code
   * @returns   Promise<InventoryTransaction[]>
   */
  private async fetchTransactionsByCode(code: string) {
    const transactions = await this.transactionModel.getByCode(code)
    if (!transactions) {
      throw boom.notFound("Transaction not found")
    }
    return transactions
  }

  private async createTransaction(transaction: transactionRequest) {
    const data = await this.buildTransactionData(transaction)
    try {
      return await this.transactionModel.create(data)
    } catch (error) {
      throw boom.badImplementation("Failed to create transaction")
    }
  }
  /**
   *  Build the transaction data
   * @param transaction
   * @returns CreateTransactionType
   */
  private buildTransactionData = async (
    transaction: transactionRequest
  ): Promise<CreateTransactionType> => {
    const data: CreateTransactionType = {
      product_id: transaction.product_id,
      quantity: transaction.quantity,
      code: transaction.code,
      transaction_type: transaction.transaction_type
    }

    return data
  }

  /**
   *  Update the transaction
   * @param transaction
   * @returns   Promise<InventoryTransaction[]>
   */
  private async updateTransaction(transaction: transactionRequest) {
    const data = await this.buildTransactionData(transaction)
    try {
      return await this.transactionModel.update(data)
    } catch (error) {
      throw boom.badImplementation("Failed to update transaction")
    }
  }
} //end class
