import Router from "express"
import { UserController } from "../controllers/user"
import { UserModelInterface } from "../models/mariadb/user"
import { validatorHandler } from "../utils/validatorHandler"
import userSchemas from "../schemas/user"

interface CreateUserRouterProps {
  userModel: UserModelInterface
}
export const createUserRouter = ({ userModel }: CreateUserRouterProps) => {
  const userRouter = Router()
  const userController = new UserController({ userModel })

  userRouter.get("/", userController.getAll)

  userRouter.get(
    "/:id",
    validatorHandler(userSchemas.get, "params"),
    userController.getById
  )

  userRouter.post(
    "/",
    validatorHandler(userSchemas.create, "body"),
    userController.create
  )

  userRouter.put(
    "/:id",
    validatorHandler(userSchemas.get, "params"),
    validatorHandler(userSchemas.update, "body"),
    userController.update
  )

  userRouter.delete(
    "/:id",
    validatorHandler(userSchemas.delete, "params"),
    userController.delete
  )

  return userRouter
}
