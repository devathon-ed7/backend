import { NextFunction, Request, Response } from "express"
import {
  CreateUserType,
  UpdateUserType,
  UserModelInterface
} from "../models/mariadb/user"
import { hashPassword } from "../utils/password-utils"
import boom from "@hapi/boom"

export class UserController {
  private userModel: UserModelInterface

  constructor({ userModel }: { userModel: UserModelInterface }) {
    this.userModel = userModel
  }

  getAll = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const users = await this.userModel.getAll()
      response.status(200).json(users)
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

      response.status(200).json(user)
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
      const { username, password } = request.body

      if (!username || !password) {
        throw boom.badRequest("Missing required fields")
        return
      }

      const hashedPassword = await hashPassword(password)

      const newUser: CreateUserType = { username, password: hashedPassword }
      const createdUser = await this.userModel.create(newUser)

      response
        .status(201)
        .json({ message: "User created successfully", user: createdUser })
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
