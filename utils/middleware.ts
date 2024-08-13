import jwt from "jsonwebtoken"
import User, { UserDocument } from "../models/mariadb/user"
import logger from "./logger"
import { NextFunction, Request, Response } from "express"
import "./custom-request.d.ts"
import { createCustomError } from "./customError"
import { errorHandler, boomErrorHandler } from "./errorHandler"
import multer from "multer"
import { v4 as uuid } from "uuid"

export const HTTP_STATUS = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
}

const requestLogger = (
  request: Request,
  _response: Response,
  next: NextFunction
) => {
  logger.info("Method:", request.method)
  logger.info("Path:  ", request.path)
  logger.info("Body:  ", request.body)
  logger.info("---")
  next()
}

const unknownEndpoint = (_request: Request, response: Response) => {
  response.status(404).render("error", {
    message: "Error: Unkown endpoint",
    error: { status: 404, stack: "" }
  })
}

const getTokenFrom = (request: Request): string | null => {
  const authorization = request.get("authorization")
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    return authorization.substring(7)
  }
  return null
}

const tokenExtractor = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  request.token = getTokenFrom(request)
  next()
}

const userExtractor = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const token = getTokenFrom(request)

    if (!token) {
      throw createCustomError("token missing or invalid", "JsonWebTokenError")
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string)

    if (typeof decodedToken === "string") {
      throw createCustomError("token invalid", "JsonWebTokenError")
    }
    if (!decodedToken.id) {
      throw createCustomError("token invalid", "JsonWebTokenError")
    }
    request.user = (await User.getById(decodedToken.id)) as UserDocument

    next()
  } catch (error) {
    next(error)
  }
}

export const omitFields = (
  user: UserDocument,
  keys: string[]
): Partial<UserDocument> => {
  return Object.fromEntries(
    Object.entries(user).map(([key, value]) => {
      if (keys.includes(key)) {
        return [key, ""]
      }
      return [key, value]
    })
  )
}

export const generateAccessToken = (user: UserDocument) => {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET as string)
}

// ✅ TODO: create a file to save the interfaces
interface RequestStorage extends Request {
  filename: string
}
const storage = multer.diskStorage({
  destination: "./build/imgs",
  filename: (req: RequestStorage, file, cb) => {
    const name = uuid().toString()
    const ext = file.originalname.split(".").pop()
    req.filename = name
    cb(null, name + "." + ext)
  }
})

export const upload = multer({ storage })

const middleware = {
  requestLogger,
  unknownEndpoint,
  boomErrorHandler,
  errorHandler,
  tokenExtractor,
  userExtractor,
  upload
}

export default middleware
