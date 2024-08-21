import { Router } from "express"
import { PermissionController } from "../controllers/permision"
import { validatorHandler } from "../utils/validatorHandler"
import permissionSchemas from "../schemas/permission"
import { PermissionModelInterface } from "../interfaces"

interface CreatePermissionRouterProps {
  permissionModel: PermissionModelInterface
}

export const createPermissionRouter = ({
  permissionModel
}: CreatePermissionRouterProps) => {
  const permissionController = new PermissionController({
    permissionModel
  })
  const router = Router()

  router.get("/", permissionController.getAll)
  router.get(
    "/:id",
    validatorHandler(permissionSchemas.get, "params"),
    permissionController.getById
  )
  router.post(
    "/",
    validatorHandler(permissionSchemas.create, "body"),
    permissionController.create
  )
  router.delete(
    "/:id",
    validatorHandler(permissionSchemas.delete, "params"),
    permissionController.delete
  )
  router.put(
    "/:id",
    validatorHandler(permissionSchemas.update, "params"),
    permissionController.update
  )
  return router
}
