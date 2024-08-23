import { Request, Response, NextFunction } from "express"
import { UserModelInterface } from "../interfaces"
import { generateAccessToken, omitFields } from "../utils/middleware"
import boom from "@hapi/boom"
import { verifyPassword } from "../utils/password-utils"

export class AuthController {
  private userModel: UserModelInterface

  constructor({ userModel }: { userModel: UserModelInterface }) {
    this.userModel = userModel
  }

  login = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { username, password } = request.body
      if (!username || !password) {
        throw boom.badRequest("All fields are necessary")
        return
      }

      const user = await this.userModel.getByUsername(username)

      if (!user) {
        throw boom.notFound("Error user or passsword is incorrect")
        return
      }

      const isPasswordCorrect = await verifyPassword(password, user.password)
      if (!isPasswordCorrect) {
        throw boom.unauthorized("Error user or passsword is incorrect")
        return
      }

      const token = generateAccessToken(user)
      const userWithoutPassword = omitFields(user, ["password"])
      response.status(200).json({ user: userWithoutPassword, token })
    } catch (error) {
      next(error)
    }
  }
}
