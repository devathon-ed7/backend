import Router from "express"
import { UserController } from "../controllers/user-controller"
import { validatorHandler } from "../utils/validatorHandler"
import userSchemas from "../schemas/user"
import { SortOrder } from "../interfaces"


export const UserRouter = () => {
  const userRouter = Router()
  const userController = new UserController()

  userRouter.get("/", (req, res, next) => {
    const page = req.query.page as number | undefined;
    const limit = req.query.limit as number | undefined;
    const sortBy = req.query.sortBy as string | undefined;
    const order = req.query.order as SortOrder | undefined;
    userController
      .getAll(page, limit, sortBy, order)
      .then((result) => res.send(result))
      .catch(next);
  });


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
    (req, res, next) => userController
      .update(req.params.id, req.body)
      .then((result) => res.send(result))
      .catch(next)
  )

  userRouter.delete(
    "/:id",
    validatorHandler(userSchemas.delete, "params"),
    userController.delete
  )

  return userRouter
}
