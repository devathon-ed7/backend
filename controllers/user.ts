import { NextFunction, Request, Response } from "express"
import {
  CreateUserType,
  UpdateUserType,
  UserDocument,
  UserModelInterface
} from "../models/mariadb/user"
import {
  CreateUserDetailsType,
  DetailsModelInterface,
  UserDetailsDocument
} from "../models/mariadb/details"
import { hashPassword } from "../utils/password-utils"
import boom from "@hapi/boom"
import { omitFields } from "../utils/middleware"
import getFileUrl from "../utils/imageUrl"

type numberRequest = number | null | undefined
type stringRequest = string | null | undefined
interface userDetailsRequest {
  id: numberRequest
  description: stringRequest
  notes: stringRequest
  role_id: numberRequest
  email: stringRequest
  name: stringRequest
  user_account_id: numberRequest
  profile_filename: stringRequest
}

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

  /**
   *  Get all the users
   * @param request
   * @param response
   * @param next
   */
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

  /**
   *  Get the user by ID
   * @param request
   * @param response
   * @param next
   * @returns
   */
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

  /**
   *  Create the user
   * @param request
   * @param response
   * @param next
   */
  create = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // Get the user details from the request body
      const { user } = request.body
      // Get the file from the request
      const file = request.file
      const profileFilename = file ? getFileUrl(request, file) : null
      // Create the user
      const createdUser = await this.createUser(user)
      // Create the user details
      await this.createUserDetails(
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

  /**
   *  Update the user
   * @param request
   * @param response
   * @param next
   */
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

      const db_user = await this.validateUserId(userId)
      await this.checkUsernameConflict(user.username, userId)

      const updatedUser = await this.updateUser(db_user, user, userId)

      if (user.user_details) {
        await this.handleUserDetails(
          user.user_details,
          db_user,
          profileFilename
        )
      }

      response
        .status(200)
        .json({ message: "User updated successfully", user: updatedUser })
    } catch (error) {
      next(error)
    }
  }

  /**
   *  Check if the username already exists
   * @param username
   */
  private checkIfUsernameExists = async (username: string): Promise<void> => {
    const existingUser = await this.userModel.getByUsername(username)
    if (existingUser) {
      throw boom.conflict("Username is already taken")
    }
  }

  /**
   *  Check if the username already exists in update methods
   * @param username
   * @param userId
   */
  private async checkUsernameConflict(
    username: string,
    userId: number
  ): Promise<void> {
    const existingUser = await this.userModel.getByUsername(username)
    if (existingUser && existingUser.id !== userId) {
      throw boom.conflict("Username is already taken")
    }
  }

  /**
   * Create the user
   * @param userPayload
   * @returns UserDocument
   */
  private async createUser(userPayload: CreateUserType): Promise<UserDocument> {
    await this.checkIfUsernameExists(userPayload.username)
    const hashedPassword = await hashPassword(userPayload.password)

    const createdUser = await this.userModel.create({
      username: userPayload.username,
      password: hashedPassword
    })

    if (!createdUser) {
      throw boom.badImplementation("User could not be created")
    }

    return createdUser
  }

  /**
   *  Create the user details
   * @param user
   * @param userDetailsPayload
   * @param profileFilename
   * @returns UserDetailsDocument
   */
  private createUserDetails = async (
    user: UserDocument,
    userDetailsPayload: userDetailsRequest,
    profileFilename: string | null
  ): Promise<UserDetailsDocument> => {
    if (!user) {
      throw new Error("User must be defined.")
    }

    const data = this.buildUserDetailsData(
      user,
      userDetailsPayload,
      profileFilename
    )

    try {
      return await this.detailsModel.create(data)
    } catch (error) {
      throw boom.badImplementation("Failed to create user details")
    }
  }

  /**
   *  Build the data for the user details
   * @param user
   * @param userDetailsPayload
   * @param profileFilename
   * @returns CreateUserDetailsType
   */
  private buildUserDetailsData(
    user: UserDocument,
    userDetailsPayload: userDetailsRequest,
    profileFilename: string | null
  ): CreateUserDetailsType {
    return {
      description: userDetailsPayload.description || null,
      notes: userDetailsPayload.notes || null,
      user_account_id: user.id,
      role_id: userDetailsPayload.role_id
        ? parseInt(userDetailsPayload.role_id.toString(), 10)
        : null,
      profile_filename: profileFilename,
      email: userDetailsPayload.email || null,
      name: userDetailsPayload.name || null
    }
  }

  /**
   *  Validate the user id
   * @param userId
   */
  private async validateUserId(userId: number): Promise<UserDocument> {
    const db_user = await this.userModel.getById(userId)
    if (!db_user) {
      throw boom.notFound("User not found")
    }
    return db_user
  }

  /**
   *  Update the user
   * @param db_user
   * @param user
   * @param userId
   * @returns
   */
  private async updateUser(
    db_user: UserDocument,
    user: UpdateUserType,
    userId: number
  ): Promise<UserDocument> {
    const data = {
      id: userId,
      username: user.username || db_user.username,
      password: user.password
        ? await hashPassword(user.password)
        : db_user.password
    }
    try {
      return await this.userModel.update(data)
    } catch (error) {
      throw boom.badImplementation("Failed to update user")
    }
  }

  /**
   *  Handle the user details
   * @param userDetails
   * @param db_user
   * @param profileFilename
   */
  private async handleUserDetails(
    userDetails: userDetailsRequest,
    db_user: UserDocument,
    profileFilename: string | null
  ): Promise<void> {
    if (!userDetails.id) {
      throw new Error("User details ID must be provided.")
    }

    const details_id = parseInt(userDetails.id.toString(), 10)
    const details = await this.detailsModel.getById(details_id)

    if (!details) {
      await this.createUserDetails(db_user, userDetails, profileFilename)
    } else {
      await this.updateUserDetails(details, userDetails, profileFilename)
    }
  }

  /**
   *  Check if the role has changed
   * @param existingRoleId
   * @param newRoleId
   * @returns boolean
   */
  private hasRoleChanged(
    existingRoleId: number | null,
    newRoleId: number | null
  ): boolean {
    return existingRoleId !== newRoleId
  }

  /**
   *  Update the user details
   * @param details
   * @param userDetails
   * @param profileFilename
   */
  private async updateUserDetails(
    details: UserDetailsDocument,
    userDetails: userDetailsRequest,
    profileFilename: string | null
  ) {
    const existingRoleId = details.role_id
    const newRoleId = userDetails.role_id
      ? parseInt(userDetails.role_id.toString(), 10)
      : null

    await this.detailsModel.update({
      ...this.prepareUpdate(details, userDetails, profileFilename),
      role_id: this.hasRoleChanged(existingRoleId, newRoleId)
        ? newRoleId
        : existingRoleId
    })
  }

  /**
   *  Prepare the update data
   * @param details
   * @param userDetails
   * @param profileFilename
   * @returns UpdateUserDetailsType
   */
  private prepareUpdate(
    details: UserDetailsDocument,
    userDetails: userDetailsRequest,
    profileFilename: string | null
  ) {
    return {
      id: details.id,
      description: userDetails.description || details.description,
      notes: userDetails.notes || details.notes,
      user_account_id: details.user_account_id,
      profile_filename: profileFilename || details.profile_filename,
      email: userDetails.email || details.email,
      name: userDetails.name || details.name
    }
  }
}
