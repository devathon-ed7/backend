import { Request, Response, NextFunction } from "express"
import {
  PermissionModelInterface,
  CreatePermissionType,
  UpdatePermissionType
} from "../interfaces"
import boom from "@hapi/boom"
import {
  deleteEntity,
  getAllEntities,
  getByNumberParam
} from "../utils/controllerUtils"

export class PermissionController {
  private permissionModel: PermissionModelInterface
  constructor({
    permissionModel
  }: {
    permissionModel: PermissionModelInterface
  }) {
    this.permissionModel = permissionModel
  }
  getAll = async (_req: Request, res: Response, next: NextFunction) =>
    await getAllEntities(_req, res, next, this.permissionModel, "permissions")

  getById = async (req: Request, res: Response, next: NextFunction) =>
    await getByNumberParam(
      req,
      res,
      next,
      this.permissionModel.getById,
      "permissions",
      "id",
      "number"
    )

  create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { name }: CreatePermissionType = req.body
      if (!name) {
        throw boom.badRequest("All data is required")
        return
      }

      const newPermission: CreatePermissionType = {
        name
      }

      const createdPermission = await this.permissionModel.create(newPermission)

      res.status(201).json({
        message: "Permission created successfully",
        permission: createdPermission
      })
    } catch (erorr) {
      next(erorr)
    }
  }

  delete = (req: Request, res: Response, next: NextFunction) =>
    deleteEntity(req, res, next, this.permissionModel, "Permission")

  update = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10)
      if (isNaN(id)) {
        throw boom.unauthorized("invalid id")
        return
      }
      const permission = await this.permissionModel.getById(id)
      if (!permission) {
        throw boom.notFound("permission not found")
        return
      }
      const { name }: UpdatePermissionType = req.body

      const data: UpdatePermissionType = {
        id,
        name
      }

      const updatedPermission = await this.permissionModel.update(data)

      res.status(201).json({
        message: "Permission updated successfully",
        permission: updatedPermission
      })
    } catch (error) {
      next(error)
    }
  }
} //end class
