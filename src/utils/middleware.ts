import User from "../models/mariadb/user";
import logger from "./logger";
import { NextFunction, Request, Response } from "express";
import { createCustomError } from "./customError";
import { errorHandler, boomErrorHandler } from "./errorHandler";
import multer from "multer";
import { v4 as uuid } from "uuid";
import JWTToken from "./JWTToken";
import { UserDocument } from "../interfaces";

const jwtToken = new JWTToken();

const requestLogger = (
  request: Request,
  _response: Response,
  next: NextFunction
) => {
  logger.info("Method:", request.method);
  logger.info("Path:  ", request.path);
  logger.info("Body:  ", request.body);
  logger.info("---");
  next();
};

const unknownEndpoint = (_request: Request, response: Response) => {
  response.status(404).render("error", {
    message: "Error: Unkown endpoint",
    error: { status: 404, stack: "" }
  });
};

const getTokenFrom = (request: Request): string | null => {
  const authorization = request.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    return authorization.substring(7);
  }
  return null;
};

const tokenExtractor = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  request.token = getTokenFrom(request);
  next();
};

const userExtractor = async (
  request: Request,
  _response: Response,
  next: NextFunction
) => {
  try {
    const token = getTokenFrom(request);

    if (!token) {
      throw createCustomError("token missing or invalid", "JsonWebTokenError");
    }

    const decodedToken = jwtToken.verify(token);

    if (typeof decodedToken === "string") {
      throw createCustomError("token invalid", "JsonWebTokenError");
    }
    if (!decodedToken.id) {
      throw createCustomError("token invalid", "JsonWebTokenError");
    }
    request.user = (await User.getById(decodedToken.id)) as UserDocument;

    next();
  } catch (error) {
    next(error);
  }
};

export const generateAccessToken = (user: UserDocument) => {
  return jwtToken.generate({ id: user.id });
};

interface RequestStorage extends Request {
  filename: string;
  filenames: string[];
}
const storage = multer.diskStorage({
  destination: "./build/imgs",
  filename: (req: RequestStorage, file, cb) => {
    const name = uuid().toString();
    const ext = file.originalname.split(".").pop();
    req.filename = name;
    cb(null, name + "." + ext);
  }
});

export const upload = multer({ storage });

const middleware = {
  requestLogger,
  unknownEndpoint,
  boomErrorHandler,
  errorHandler,
  tokenExtractor,
  userExtractor,
  upload
};

export default middleware;
