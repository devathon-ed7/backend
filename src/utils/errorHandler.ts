import { Request, Response, NextFunction } from "express"
import logger from "./logger"
import boom from "@hapi/boom"
import { HTTP_STATUS } from "./middleware"

export const boomErrorHandler = (
  error: unknown,
  request: Request,
  response: Response,
  next: NextFunction
): void => {
  if (boom.isBoom(error)) {
    const { output } = error as boom.Boom
    response.status(output.statusCode).json(output.payload)
  } else {
    next(error)
  }
}

// Función para manejar errores específicos
const handleSpecificError = (error: Error, response: Response) => {
  switch (error.name) {
    case "CastError":
      return response
        .status(HTTP_STATUS.BAD_REQUEST)
        .send({ error: "malformatted id" })
    case "ValidationError":
      return response
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ error: error.message })
    case "JsonWebTokenError":
    case "TokenExpiredError":
      return response.status(HTTP_STATUS.UNAUTHORIZED).json({
        error:
          error.name === "TokenExpiredError" ? "token expired" : error.message
      })
    case "BadRequest":
    case "Unauthorized":
    case "NotFound":
      return response
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ error: error.message })
    default:
      return response.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        error: "Internal Server Error"
      })
  }
}

export const errorHandler = (
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction
) => {
  logger.error("Middleware: ErrorHandler : ", error.message, error.name)
  handleSpecificError(error, response)
  next(error) // Mueve el next fuera del switch
}
