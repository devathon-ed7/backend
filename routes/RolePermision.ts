import { Router } from "express"
import { RolePersmissionController } from "../controllers/RolePersmission"
import { validatorHandler } from "../utils/validatorHandler"
import rolePermissionSchemas from "../schemas/RolePermission"
import { RolePermissionModelInterface } from "../interfaces"

interface CreateRolePermissionProps {
  rolePermissionModel: RolePermissionModelInterface
}

export const CreateRolePersmissionRoutes = ({
  rolePermissionModel
}: CreateRolePermissionProps): Router => {
  const rolePersmissionController = new RolePersmissionController({
    rolePermissionModel
  })

  const router = Router()
  router.post(
    "/",
    validatorHandler(rolePermissionSchemas.create, "body"),
    rolePersmissionController.create
  )
  router.put(
    "/",
    validatorHandler(rolePermissionSchemas.update, "body"),
    rolePersmissionController.update
  )
  router.get(
    "/:role_id",
    validatorHandler(rolePermissionSchemas.getPermissonsForRole, "params"),
    rolePersmissionController.getPermissionsForRole
  )
  return router
}
