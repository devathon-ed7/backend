import { type NextFunction, type Request, type Response } from "express"
import { CreateTransactionType,  TransactionModelInterface } from "../models/mariadb/transaction"
import boom from "@hapi/boom"

interface transactionRequest {
  product_id: number
  quantity: number
  code: string
  transaction_type: transaction_type
}

type transaction_type = "in" | "out"

export class TransactionController {
  private transactionModel: TransactionModelInterface
  constructor({transactionModel}: {transactionModel: TransactionModelInterface}) {
    this.transactionModel = transactionModel
  }

  getAll = async (_request: Request, response: Response, next: NextFunction) => {
    try{
      const transactions = await this.transactionModel.getAll()
      response.status(200).json({ transactions })
    }catch (error) {
      next(error)
    }
  }
  //get transactions by product id
  getByProudctId = async (request: Request, response: Response, next: NextFunction) => {
    try{
      const id = this.extractProductId(request);
      const transactions = await this.fetchTransactionsByProductId(id);
      response.status(200).json({ transactions:transactions })
    }catch (error) {
      next(error)
    }
  }
  // get transactions by code
  getByCode = async (request: Request, response: Response, next: NextFunction) => {
    try{
      const code = this.extractCode(request);
      const transactions = await this.fetchTransactionsByCode(code);
      response.status(200).json({ transactions:transactions })
    }catch (error) {
      next(error)
    }
  }
  //create transaction
  create = async (request: Request, response: Response, next: NextFunction) => {
    try{
      const { transaction } = request.body;
      const transactions = await this.createTransaction(transaction);
      response.status(201).json({ transactions:transactions })
    }catch (error) {
      next(error)
    }
  }
  //update transaction
  update = async (request: Request, response: Response, next: NextFunction) => {
    try{
      const { transaction } = request.body;
      const transactions = await this.updateTransaction(transaction);
      response.status(201).json({ transactions:transactions })
    }catch (error) {
      next(error)
    }
  }
 
  
  /**
   *  Extract the product id from the request
   * @param request 
   * @returns  number
   */
  private extractProductId(request: Request): number {
    const id = parseInt(request.params.id);
    if (isNaN(id)) {
      throw boom.badRequest("Id product is missing");
    }
    return id;
  }

  /**
   *  Fetch the transactions by product id
   * @param id 
   * @returns   Promise<InventoryTransaction[]>
   */
  private async fetchTransactionsByProductId(id: number) {
    const transactions = await this.transactionModel.getByProductId(id);
    if (!transactions) {
      throw boom.notFound("Transaction not found");
    }
    return transactions;
  }

  /**
   *  Extract the code from the request
   * @param request 
   * @returns string
   */
  private extractCode(request: Request): string {
    const code = request.params.code;
    if (!code) {
      throw boom.badRequest("Code is missing");
    }
    return code;
  }

  /**
   *  Fetch the transactions by code
   * @param code 
   * @returns   Promise<InventoryTransaction[]>
   */
  private async fetchTransactionsByCode(code: string) {
    const transactions = await this.transactionModel.getByCode(code);
    if (!transactions) {
      throw boom.notFound("Transaction not found");
    }
    return transactions;
  }

  private async createTransaction(transaction: transactionRequest) {
    const data = await this.buildTransactionData(transaction);
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
    const data = await this.buildTransactionData(transaction);
    try {
      return await this.transactionModel.update(data)
    } catch (error) {
      throw boom.badImplementation("Failed to update transaction")
    }
  }
}//end class