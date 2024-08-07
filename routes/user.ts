import Router from "express"
import { UserController } from "../controllers/user"
import { UserModelInterface } from "../models/mariadb/user"
import { validatorHandler } from "../utils/validatorHandler"
import userSchema from "../schemas/user"

interface CreateUserRouterProps {
  userModel: UserModelInterface
}
export const createUserRouter = ({ userModel }: CreateUserRouterProps) => {
  const userRouter = Router()
  const userController = new UserController({ userModel })

  userRouter.get("/", userController.getAll)

  userRouter.get(
    "/:id",
    validatorHandler(userSchema.get, "params"),
    userController.getById
  )

  userRouter.post(
    "/",
    validatorHandler(userSchema.create, "body"),
    userController.create
  )

  userRouter.put(
    "/:id",
    validatorHandler(userSchema.get, "params"),
    validatorHandler(userSchema.update, "body"),
    userController.update
  )

  userRouter.delete(
    "/:id",
    validatorHandler(userSchema.delete, "params"),
    userController.delete
  )

  return userRouter
}
