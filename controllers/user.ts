import { NextFunction, Request, Response } from "express"
import {
  CreateUserType,
  UpdateUserType,
  UserDocument,
  UserModelInterface
} from "../models/mariadb/user"
import {
  CreateDetailType,
  DetailsModelInterface,
  DetailsDocument
} from "../models/mariadb/details"
import { hashPassword } from "../utils/password-utils"
import boom from "@hapi/boom"
import { omitFields } from "../utils/middleware"

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
      const profileFilename = file ? getFileUrl(request, file) : null
      // Create the user
      const createdUser = await this.createUser(user)
      // Create the user details
      const updatedUser = await this.createUserDetails(
        createdUser,
        user.user_details,
        profileFilename
      )

      // Omit the password from the response
      const userResponse = omitFields(createdUser, ["password"])

      response.status(201).json({
        message: "User created successfully",
        newUser: userResponse
      })
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
      const { user } = request.body
      const file = request.file
      const profileFilename = file ? getFileUrl(request, file) : null
      // Check if id valid
      if (isNaN(userId)) {
        throw boom.unauthorized("Invalid user ID")
        return
      }
      // Check if user exists
      const db_user = await this.userModel.getById(userId)
      if (!db_user) {
        throw boom.notFound("User not found")
        return
      }

      // Check if the new username is already taken by another user
      const existingUser = await this.userModel.getByUsername(user.username)
      if (existingUser && existingUser.id !== userId) {
        throw boom.conflict("Username is already taken")
        return
      }
      const data = {
        id: userId,
        username: user.username || db_user.username,
        password: user.password
          ? await hashPassword(user.password)
          : db_user.password // Use existing password if not provided
      }

      const updated = await this.userModel.update(data)

      // details for user request
      const user_details = user.user_details
      console.log("user_details", user_details)
      if (user_details) {
        const details = await this.detailsModel.getById(
          parseInt(user_details.id, 10)
        )
        console.log("details from detailsModel", details)
        if (!details) {
          await this.detailsModel.create({
            description: user_details.description,
            notes: user_details.notes || null,
            user_account_id: userId,
            role_id: parseInt(user_details.role_id, 10) || null,
            profile_filename: profileFilename,
            email: user_details.email || null,
            name: user_details.name || null
          })
        } else {
          await this.detailsModel.update({
            id: details.id,
            description: user_details.description || details.description,
            notes: user_details.notes || details.notes,
            user_account_id: details.user_account_id,
            role_id: parseInt(user_details.role_id, 10) || details.role_id,
            profile_filename: profileFilename || details.profile_filename,
            email: user_details.email || details.email,
            name: user_details.name || details.name
          })
        }
      }

      response
        .status(200)
        .json({ message: "User updated successfully", user: updated })
    } catch (error) {
      next(error)
    }
  }

  private createUser = async (userPayload: CreateUserType) => {
    // Check if the new username is already taken by another user
    const existingUser = await this.userModel.getByUsername(
      userPayload.username
    )
    if (existingUser) {
      throw boom.conflict("Username is already taken")
      return
    }

    // Hash the password
    const hashedPassword = await hashPassword(userPayload.password)

    // Create the user
    return await this.userModel.create({
      username: userPayload.username,
      password: hashedPassword
    })
  } // CreateUser

  private createUserDetails = async (
    user: UserDocument,
    userDetailsPayload: CreateDetailType,
    profileFilename: string | null
  ) => {
    const role_id = userDetailsPayload.role_id
      ? parseInt(userDetailsPayload.role_id.toString(), 10)
      : null

    const data = {
      description: userDetailsPayload.description || null,
      notes: userDetailsPayload.notes || null,
      user_account_id: user.id,
      role_id,
      profile_filename: profileFilename,
      email: userDetailsPayload.email || null,
      name: userDetailsPayload.name || null
    }

    // Create the user details
    return await this.detailsModel.create(data)
  } // CreateUserDetails
}
