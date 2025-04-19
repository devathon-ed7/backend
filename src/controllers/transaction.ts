import { type NextFunction, type Request, type Response } from "express"
import { SortOrder, TransactionModelInterface } from "../interfaces"
import boom from "@hapi/boom"


export class TransactionController {
  private transactionModel: TransactionModelInterface
  constructor({
    transactionModel
  }: {
    transactionModel: TransactionModelInterface
  }) {
    this.transactionModel = transactionModel
  }

  getAll = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(_req.query.page as string) || 1
      const limit = parseInt(_req.query.limit as string) || 10
      const sort = (_req.query.sort as string) || "id"
      const order: SortOrder = (_req.query.order as SortOrder) || "asc"
      const [transactions, totalTransactions] = await Promise.all([
        this.transactionModel.getAll(page, limit, sort, order),
        this.transactionModel.count()
      ])
      const totalPages = Math.ceil(totalTransactions / limit)
      res.status(200).json({
        transactions,
        totalTransactions,
        totalPages,
        currentPage: page,
        sort: {
          sortBy: sort,
          order
        }
      })
    } catch (error) {
      next(error)
    }
  }

  getByProductId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product_id = req.params.product_id
      if (!product_id) {
        throw boom.unauthorized("Invalid product ID")
      }
      const transactions = await this.transactionModel.getByProductId(product_id)
      if (!transactions) {
        throw boom.notFound("Transaction not found")
      }
      res.status(200).json({ transactions })
    } catch (error) {
      next(error)
    }
  }


  getByCode = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const code = req.params.code
      if (!code) {
        throw boom.unauthorized("Invalid code")
      }
      const transactions = await this.transactionModel.getByCode(code)
      if (!transactions) {
        throw boom.notFound("Transaction not found")
      }
      res.status(200).json({ transactions })
    } catch (error) {
      next(error)
    }
  }


  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { transaction } = req.body

      const transactions = await this.transactionModel.create(transaction)

      res.status(201).json({ transactions: transactions })
    } catch (error) {
      next(error)
    }
  }

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id
      if (!id) {
        throw boom.unauthorized("Invalid transaction ID")
      }
      const { transaction } = req.body
      if (!transaction || transaction.id !== id) {
        throw boom.unauthorized("Invalid transaction ID")
      }
      const transactions = await this.transactionModel.update(transaction)
      res.status(200).json({ transactions: transactions })
    } catch (error) {
      next(error)
    }
  }

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id
      if (!id) {
        throw boom.unauthorized("Invalid transaction ID")
      }
      const transactions = await this.transactionModel.getById(id)
      if (!transactions) {
        throw boom.notFound("Transaction not found")
      }
      await this.transactionModel.delete(id)
      res.status(204).send()
    } catch (error) {
      next(error)
    }
  }


} //end class
