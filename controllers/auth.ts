import { Request, Response, NextFunction } from "express"
import { UserModelInterface } from "../interfaces"
import { generateAccessToken, omitFields } from "../utils/middleware"
import boom from "@hapi/boom"
import { verifyPassword } from "../utils/password-utils"
import dotenv from "dotenv"
import logger from "../utils/logger"
import axios, { AxiosResponse } from "axios"

dotenv.config()

const TIME_OUT = 5000
const clientId = process.env.CLIENT_ID
const clientSecret = process.env.CLIENT_SECRET
const githubApiUrl = process.env.GITHUB_API_URL
const githubUrlUser = process.env.GITHUB_URL_USER
const frontendUrl = process.env.FRONTEND_URL
const url = `${githubApiUrl}?client_id=${clientId}&client_secret=${clientSecret}&code=`

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
      }

      const user = await this.userModel.getByUsername(username)

      if (!user) {
        throw boom.notFound("Error user or passsword is incorrect")
      }

      const isPasswordCorrect = await verifyPassword(password, user.password)
      if (!isPasswordCorrect) {
        throw boom.unauthorized("Error user or passsword is incorrect")
      }

      const token = generateAccessToken(user)
      const userWithoutPassword = omitFields(user, ["password"])
      response.status(200).json({ user: userWithoutPassword, token })
    } catch (error) {
      next(error)
    }
  }

  getGithubUser = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const token = request.headers["authorization"]

      if (!token) {
        throw boom.unauthorized("Authorization token is missing")
      }

      const result = await axios({
        method: "GET",
        url: githubUrlUser,
        headers: {
          Authorization: token
        },
        timeout: TIME_OUT
      })

      response.status(200).send(result.data)
    } catch (error: unknown) {
      logger.error(`Error occurred: ${error}`)
      next(error)
    }
  }

  callbackGithub = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const code = request.query.code

      if (!code) {
        throw boom.badRequest("Code is missing")
      }

      const result: AxiosResponse<{ access_token: string }> = await axios({
        method: "POST",
        url: url + `${code}`,
        headers: {
          Accept: "application/json"
        }
      })

      response.redirect(
        `${frontendUrl}?access_token=${result.data.access_token}`
      )
    } catch (error: unknown) {
      logger.error(`Error occurred: ${error}`)
      next(error)
    }
  }
}
