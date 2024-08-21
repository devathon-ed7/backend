import { Request, Response, NextFunction } from "express"
import {
  RoleModelInterface,
  CreateRoleType,
  UpdateRoleType
} from "../interfaces"
import boom from "@hapi/boom"
import {
  deleteEntity,
  getAllEntities,
  getByNumberParam
} from "../utils/controllerUtils"

export class RoleController {
  private roleModel: RoleModelInterface

  constructor({ roleModel }: { roleModel: RoleModelInterface }) {
    this.roleModel = roleModel
  }

  getAll = async (_req: Request, res: Response, next: NextFunction) =>
    await getAllEntities(_req, res, next, this.roleModel, "roles")

  getById = async (req: Request, res: Response, next: NextFunction) =>
    await getByNumberParam(
      req,
      res,
      next,
      this.roleModel.getById,
      "roles",
      "id",
      "number"
    )

  create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { name, description } = req.body

      if (!name || !description) {
        throw boom.badRequest("Missing required fields")
        return
      }

      const newRole: CreateRoleType = { name, description }
      const createdRole = await this.roleModel.create(newRole)

      res
        .status(201)
        .json({ message: "Role created successfully", role: createdRole })
    } catch (error) {
      next(error)
    }
  }

  delete = async (req: Request, res: Response, next: NextFunction) =>
    deleteEntity(req, res, next, this.roleModel, "role")

  update = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const roleId = parseInt(req.params.id, 10)
      const { name, description } = req.body

      if (isNaN(roleId)) {
        throw boom.unauthorized("Invalid role ID")
        return
      }

      const role = await this.roleModel.getById(roleId)
      if (!role) {
        throw boom.notFound("Role not found")
        return
      }

      const data = {
        id: roleId,
        name,
        description
      }

      const updatedRole: UpdateRoleType = data

      const updated = await this.roleModel.update(updatedRole)

      res.status(204).json(updated)
    } catch (error) {
      next(error)
    }
  }
} //end class
