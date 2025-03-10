import Router from "express"
import { RoleController } from "../controllers/role"
import { RoleModelInterface } from "../interfaces"
import { validatorHandler } from "../utils/validatorHandler"
import rolesSchema from "../schemas/role"

interface CreateRoleRouterProps {
  roleModel: RoleModelInterface
}

export const createRoleRouter = ({ roleModel }: CreateRoleRouterProps) => {
  const roleController = new RoleController({ roleModel })
  const router = Router()

  router.get("/", roleController.getAll)
  router.get(
    "/:id",
    validatorHandler(rolesSchema.get, "params"),
    roleController.getById
  )
  router.post(
    "/",
    validatorHandler(rolesSchema.create, "body"),
    roleController.create
  )
  router.put(
    "/:id",
    validatorHandler(rolesSchema.update, "params"),
    roleController.update
  )
  router.delete(
    "/:id",
    validatorHandler(rolesSchema.delete, "params"),
    roleController.delete
  )

  return router
}
