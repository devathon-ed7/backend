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
//github
const clientId = process.env.CLIENT_ID
const clientSecret = process.env.CLIENT_SECRET
const githubApiUrl = process.env.GITHUB_API_URL
const githubUrlUser = process.env.GITHUB_URL_USER
const frontendUrl = process.env.FRONTEND_URL
//google
const googleClientId: string = process.env.GOOGLE_CLIENT_ID as string
const googleClientSecret: string = process.env.GOOGLE_CLIENT_SECRET as string
const googleApiUrl: string = process.env.GOOGLE_API_URL as string
const googleApiUser: string = process.env.GOOGLE_API_USER as string
const googleRedirectUri: string = process.env.GOOGLE_REDIRECT_URI as string

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
      const { email, password } = request.body
      if (!email || !password) {
        throw boom.badRequest("All fields are necessary")
      }

      const user = await this.userModel.getByEmail(email)

      if (!user) {
        throw boom.notFound("Error wrong email or password")
      }

      const isPasswordCorrect = await verifyPassword(password, user.password)
      if (!isPasswordCorrect) {
        throw boom.unauthorized("Error wrong email or password")
      }

      const token = generateAccessToken(user)
      const userWithoutPassword = omitFields(user, ["password"])
      response.status(200).json({ user: userWithoutPassword, token })
    } catch (error) {
      next(error)
    }
  }

  register = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { fullName, password, email } = request.body
      if (!fullName || !password || !email) {
        throw boom.badRequest("All fields are necessary")
      }

      const user = await this.userModel.getByEmail(email)

      if (user) {
        throw boom.badRequest("Username already exists")
      }

      const newUser = await this.userModel.create({
        full_name: fullName,
        password,
        email
      })

      const token = generateAccessToken(newUser)
      const userWithoutPassword = omitFields(newUser, ["password"])
      response.status(201).json({ user: userWithoutPassword, token })
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
        url: `${githubApiUrl}?client_id=${clientId}&client_secret=${clientSecret}&code=${code}`,
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

  callbackGoogle = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const code: string = request.query.code as string

      if (!code) {
        throw boom.badRequest("Code is missing")
      }

      const tokenUrl = `${googleApiUrl}?client_id=${googleClientId}&client_secret=${googleClientSecret}&code=${code}&redirect_uri=${googleRedirectUri}&grant_type=authorization_code`

      const result: AxiosResponse<{ access_token: string }> = await axios({
        method: "POST",
        url: tokenUrl,
        headers: {
          Accept: "application/json"
        }
      })

      response.redirect(
        `${frontendUrl}?access_token=${result.data.access_token}`
      )
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        logger.error(`Axios error: ${error.response?.data}`)
        logger.error(`Status code: ${error.response?.status}`)
      } else {
        logger.error(`Error occurred: ${error}`)
      }
      next(error)
    }
  }
}
