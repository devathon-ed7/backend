import Router from "express"
import { UserController } from "../controllers/user"
import { UserModelInterface } from "../models/mariadb/user"
import { validatorHandler } from "../utils/validatorHandler"
import userSchemas from "../schemas/user"
import { DetailsModelInterface } from "../models/mariadb/details"

interface CreateUserRouterProps {
  userModel: UserModelInterface
  detailsModel: DetailsModelInterface
}
export const createUserRouter = ({
  userModel,
  detailsModel
}: CreateUserRouterProps) => {
  const userRouter = Router()
  const userController = new UserController({ userModel, detailsModel })

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
