import { Request, Response, NextFunction } from "express"
import {
  RoleModelInterface,
  CreateRoleType,
  UpdateRoleType
} from "../models/mariadb/roles"
import boom from "@hapi/boom"

export class RoleController {
  private roleModel: RoleModelInterface

  constructor({ roleModel }: { roleModel: RoleModelInterface }) {
    this.roleModel = roleModel
  }

  getAll = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const roles = await this.roleModel.getAll()
      res.status(200).json(roles)
    } catch (error) {
      next(error)
    }
  }

  getById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const roleId = parseInt(req.params.id, 10)
      if (isNaN(roleId)) {
        throw boom.unauthorized("Invalid role ID")
        return
      }
      const role = await this.roleModel.getById(roleId)
      if (!role) {
        throw boom.notFound("Role not found")
        return
      }
      res.status(200).json(role)
    } catch (error) {
      next(error)
    }
  }

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

  delete = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const roleId = parseInt(req.params.id, 10)
      if (isNaN(roleId)) {
        throw boom.unauthorized("Invalid role ID")
        return
      }
      const deletedRole = await this.roleModel.getById(roleId)
      if (!deletedRole) {
        throw boom.notFound("Role not found")
        return
      }
      await this.roleModel.delete(roleId)
      res.status(204).json({ message: "Role deleted successfully" })
    } catch (error) {
      next(error)
    }
  }

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
