import { Router } from "express"
import { DetailsController } from "../controllers/details"
import {
  DetailsModelInterface,
  RoleModelInterface,
  UserModelInterface
} from "../interfaces"

interface createDetailsRouterProps {
  detailsModel: DetailsModelInterface
  userModel: UserModelInterface
  roleModel: RoleModelInterface
}

export const createDetailsRouter = ({
  detailsModel,
  userModel,
  roleModel
}: createDetailsRouterProps) => {
  const detailsController = new DetailsController({
    detailsModel,
    userModel,
    roleModel
  })
  const detailsRouter = Router()

  detailsRouter.get("/:id", detailsController.getById)
  detailsRouter.get("/", detailsController.getAll)
  detailsRouter.post("/", detailsController.create)
  // detailsRouter.delete("/:id", detailsController.delete)
  detailsRouter.put("/:id", detailsController.update)

  return detailsRouter
}
