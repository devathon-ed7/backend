import { Request, Response, NextFunction } from "express"
import {
  DetailsModelInterface,
  CreateUserDetailsType,
  UpdateUserDetailsType,
  UserModelInterface,
  RoleModelInterface
} from "../interfaces"
import { getFileUrl } from "../utils/imageUrl"
import boom from "@hapi/boom"
import { getAllEntities } from "../utils/controllerUtils"

export class DetailsController {
  private detailsModel: DetailsModelInterface
  private userModel: UserModelInterface
  private roleModel: RoleModelInterface

  constructor({
    detailsModel,
    userModel,
    roleModel
  }: {
    detailsModel: DetailsModelInterface
    userModel: UserModelInterface
    roleModel: RoleModelInterface
  }) {
    this.detailsModel = detailsModel
    this.userModel = userModel
    this.roleModel = roleModel
  }

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id)
      if (isNaN(id)) {
        throw boom.unauthorized("Invalid Detail Id")
      }

      const deatils = await this.detailsModel.getById(id)

      if (!deatils) {
        throw boom.notFound("Detail not found")
      }

      res.status(200).json(deatils)
    } catch (error) {
      next(error)
    }
  }

  getAll = async (req: Request, res: Response, next: NextFunction) =>
    await getAllEntities(req, res, next, this.detailsModel, "details")

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        name,
        description,
        notes,
        email,
        user_account_id,
        role_id
      }: CreateUserDetailsType = req.body
      //image
      const file = req.file

      if (!user_account_id) {
        throw boom.badRequest("user_account_id is required")
      }

      const user_account = await this.userModel.getById(user_account_id)

      if (!user_account) {
        throw boom.notFound("User Account not found")
      }

      if (role_id != null) {
        if (!(await this.roleModel.getById(parseInt(`${role_id}`)))) {
          throw boom.notFound("Role not found")
        }
      }

      const data: CreateUserDetailsType = {
        name,
        description,
        notes,
        email,
        user_account_id,
        profile_filename: file ? getFileUrl(req, file) : null,
        role_id
      }

      const details = await this.detailsModel.create(data)
      res.status(200).json(details)
    } catch (error) {
      next(error)
    }
  }

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id)
      const {
        name,
        description,
        notes,
        email,
        role_id
      }: UpdateUserDetailsType = req.body
      //image
      const file = req.file

      if (isNaN(id)) {
        throw boom.badRequest("Id is missing")
      }

      if (!(await this.detailsModel.getById(id))) {
        throw boom.notFound("User Details not found")
      }

      const data = {
        id: id,
        name,
        description,
        notes,
        email,
        role_id,
        profile_filename: file ? getFileUrl(req, file) : null
      }

      const details = await this.detailsModel.update(data)

      res.status(200).json(details)
    } catch (error) {
      next(error)
    }
  }
}
