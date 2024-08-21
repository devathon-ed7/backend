import { type NextFunction, type Request, type Response } from "express"
import { CreateTransactionType, TransactionModelInterface } from "../interfaces"
import boom from "@hapi/boom"
import {
  deleteEntity,
  getAllEntities,
  getByNumberParam,
  getByStringParam
} from "../utils/controllerUtils"

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

  getByProductId = async (req: Request, res: Response, next: NextFunction) =>
    await getByNumberParam(
      req,
      res,
      next,
      this.transactionModel.getByProductId,
      "transactions",
      "product_id",
      "number"
    )

  getByCode = async (req: Request, res: Response, next: NextFunction) =>
    await getByStringParam(
      req,
      res,
      next,
      this.transactionModel.getByCode,
      "transactions",
      "code"
    )

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { transaction } = req.body
      const transactions = await this.createTransaction(transaction)
      res.status(201).json({ transactions: transactions })
    } catch (error) {
      next(error)
    }
  }

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { transaction } = req.body
      const transactions = await this.updateTransaction(transaction)
      res.status(200).json({ transactions: transactions })
    } catch (error) {
      next(error)
    }
  }

  delete = async (req: Request, res: Response, next: NextFunction) =>
    deleteEntity(req, res, next, this.transactionModel, "transaction")

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
