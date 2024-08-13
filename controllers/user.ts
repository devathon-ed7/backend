import { NextFunction, Request, Response } from "express"
import {
  CreateUserType,
  UpdateUserType,
  UserModelInterface
} from "../models/mariadb/user"
import { hashPassword } from "../utils/password-utils"
import boom from "@hapi/boom"
import { omitFields } from "../utils/middleware"
import { DetailsModelInterface } from "../models/mariadb/details"
import getFileUrl from "../utils/imageUrl"

export class UserController {
  private userModel: UserModelInterface
  private detailsModel: DetailsModelInterface

  constructor({
    userModel,
    detailsModel
  }: {
    userModel: UserModelInterface
    detailsModel: DetailsModelInterface
  }) {
    this.userModel = userModel
    this.detailsModel = detailsModel
  }

  getAll = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const users = await this.userModel.getAll()
      response.status(200).json({ users: users })
    } catch (error) {
      next(error)
    }
  }

  getById = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = parseInt(request.params.id, 10)

      if (isNaN(userId)) {
        throw boom.unauthorized("Invalid user ID")
        return
      }

      const user = await this.userModel.getById(userId)
      if (!user) {
        throw boom.notFound("User not found")
        return
      }

      const userWithoutPassword = omitFields(user, ["password"])
      response.status(200).json({ user: userWithoutPassword })
    } catch (error) {
      next(error)
    }
  }

  create = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { user } = request.body
      const file = request.file
      // Check if the new username is already taken by another user
      const existingUser = await this.userModel.getByUsername(user.username)
      if (existingUser) {
        throw boom.conflict("Username is already taken")
        return
      }
      const data = {
        username: user.username,
        password: await hashPassword(user.password)
      }
      //create user in user_account table
      const newUser: CreateUserType = data
      const createdUser = await this.userModel.create(newUser)
      // user details

      const user_details = user.user_details
      if (user_details) {
        await this.detailsModel.create({
          description: user_details.description || null,
          notes: user_details.notes || null,
          user_account_id: createdUser.id,
          role_id: parseInt(user_details.role_id, 10) || null,
          profile_filename: getFileUrl(request, file) || null,
          email: user_details.email || null,
          name: user_details.name || null
        })
      }

      response
        .status(201)
        .json({ message: "User created successfully", newUser: createdUser })
    } catch (error) {
      next(error)
    }
  }

  delete = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = parseInt(request.params.id, 10)

      if (isNaN(userId)) {
        throw boom.unauthorized("Invalid user ID")
        return
      }

      const deletedUser = await this.userModel.getById(userId)
      if (!deletedUser) {
        throw boom.notFound("User not found")
        return
      }

      await this.userModel.delete(userId)
      response.status(204).json({ message: "User deleted successfully" })
    } catch (error) {
      next(error)
    }
  }

  update = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = parseInt(request.params.id, 10)
      const { username, password } = request.body
      // Check if id valid
      if (isNaN(userId)) {
        throw boom.unauthorized("Invalid user ID")
        return
      }
      // Check if user exists
      const user = await this.userModel.getById(userId)
      if (!user) {
        throw boom.notFound("User not found")
        return
      }

      // Check if the new username is already taken by another user
      const existingUser = await this.userModel.getByUsername(username)
      if (existingUser && existingUser.id !== userId) {
        throw boom.conflict("Username is already taken")
        return
      }

      const data = {
        id: userId,
        username: username || user.username,
        password: password ? await hashPassword(password) : user.password // Use existing password if not provided
      }

      const updatedUser: UpdateUserType = data

      const updated = await this.userModel.update(updatedUser)

      response
        .status(200)
        .json({ message: "User updated successfully", user: updated })
    } catch (error) {
      next(error)
    }
  }
}
