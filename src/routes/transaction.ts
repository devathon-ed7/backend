import { Router } from "express"
import { TransactionController } from "../controllers/transaction"
import transactionSchemas from "../schemas/transaction"
import { validatorHandler } from "../utils/validatorHandler"
import { TransactionModelInterface } from "../interfaces"

interface CreateTransactionRouterProps {
  transactionModel: TransactionModelInterface
}

export const createTransactionRouter = ({
  transactionModel
}: CreateTransactionRouterProps) => {
  const transactionController = new TransactionController({ transactionModel })
  const transactionRouter = Router()

  transactionRouter.get("/", transactionController.getAll)
  transactionRouter.post(
    "/",
    validatorHandler(transactionSchemas.create, "body"),
    transactionController.create
  )
  transactionRouter.get(
    "/product/:id",
    validatorHandler(transactionSchemas.getByProductId, "params"),
    transactionController.getByProductId
  )
  transactionRouter.get(
    "/code/:code",
    validatorHandler(transactionSchemas.getByCode, "params"),
    transactionController.getByCode
  )
  transactionRouter.put(
    "/:id",
    validatorHandler(transactionSchemas.update, "params"),
    transactionController.update
  )
  transactionRouter.delete(
    "/:id",
    validatorHandler(transactionSchemas.delete, "params"),
    transactionController.delete
  )

  return transactionRouter
}
