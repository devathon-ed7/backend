import { UserModelInterface } from "../models/mariadb/user"
import { Request, Response, NextFunction } from "express"
import { CustomError } from "../utils/customError"
import { DetailsModelInterface } from "../models/mariadb/details"
import { CreateDeatilType } from "../models/mariadb/details"
import { UpdateDeatilType } from "../models/mariadb/details"
import { RoleModelInterface } from "../models/mariadb/roles"

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

  getById = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const id = parseInt(request.params.id)
      if (isNaN(id)) {
        throw CustomError.Unauthorized("Invalid Detail Id")
      }

      const deatils = await this.detailsModel.getById(id)

      if (!deatils) {
        throw CustomError.NotFound("Detail not found")
      }

      response.status(200).json(deatils)
    } catch (error) {
      next(error)
    }
  }

  getAll = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const details = await this.detailsModel.getAll()
      response.status(200).json(details)
    } catch (error) {
      next(error)
    }
  }

  create = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const {
        name,
        description,
        notes,
        email,
        user_account_id,
        role_id
      }: CreateDeatilType = request.body

      if (!user_account_id) {
        throw CustomError.BadRequest("user_account_id is required")
      }

      const user_account = await this.userModel.getById(user_account_id)

      if (!user_account) {
        throw CustomError.NotFound("User Account not found")
      }

      if (role_id != null) {
        if (!(await this.roleModel.getById(parseInt(`${role_id}`)))) {
          throw CustomError.NotFound("Role not found")
        }
      }

      const data: CreateDeatilType = {
        name,
        description,
        notes,
        email,
        user_account_id,
        profile_filename: `https://ui-avatars.com/api/?name=${user_account.username}`,
        role_id
      }

      const details = await this.detailsModel.create(data)
      response.status(200).json(details)
    } catch (error) {
      next(error)
    }
  }

  // delete = async (request: Request, response: Response, next: NextFunction) => {
  //   try {
  //     const id = parseInt(request.params.id)

  //     if (isNaN(id)) {
  //       throw CustomError.BadRequest("Id is missing")
  //     }

  //     if (!(await this.detailsModel.getById(id))) {
  //       throw CustomError.NotFound("User Details not found")
  //     }

  //     await this.userModel.delete(id)
  //     response
  //       .status(200)
  //       .json({ message: "User Details deleted successfully" })
  //   } catch (error) {
  //     next(error)
  //   }
  // }

  update = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const id = parseInt(request.params.id)
      const { name, description, notes, email, role_id }: UpdateDeatilType =
        request.body

      if (isNaN(id)) {
        throw CustomError.BadRequest("Id is missing")
      }

      if (!(await this.detailsModel.getById(id))) {
        throw CustomError.NotFound("User Details not found")
      }

      const data = {
        id: id,
        name,
        description,
        notes,
        email,
        role_id
      }

      const details = await this.detailsModel.update(data)

      response.status(200).json(details)
    } catch (error) {
      next(error)
    }
  }
}
