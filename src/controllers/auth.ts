import { Request, Response, NextFunction } from "express";
import { UserModelInterface } from "../interfaces";
import { generateAccessToken, omitFields } from "../utils/middleware";
import boom from "@hapi/boom";
import { hashPassword, verifyPassword } from "../utils/password-utils";

import dotenv from "dotenv";
import logger from "../utils/logger";
import axios, { AxiosResponse } from "axios";

dotenv.config();

const TIME_OUT = 5000;
//github
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const githubApiUrl = process.env.GITHUB_API_URL;
const githubUrlUser = process.env.GITHUB_URL_USER;
const frontendUrl = process.env.FRONTEND_URL;
//google
const googleClientId: string = process.env.GOOGLE_CLIENT_ID as string;
const googleClientSecret: string = process.env.GOOGLE_CLIENT_SECRET as string;
const googleApiUrl: string = process.env.GOOGLE_API_URL as string;
const googleRedirectUri: string = process.env.GOOGLE_REDIRECT_URI as string;

export class AuthController {
  private userModel: UserModelInterface;

  constructor({ userModel }: { userModel: UserModelInterface }) {
    this.userModel = userModel;
  }

  login = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { email, password } = request.body;
      if (!email || !password) {
        throw boom.badRequest("All fields are necessary");
      }

      const user = await this.userModel.getByEmail(email);

      if (!user) {
        throw boom.notFound("Error wrong email or password");
      }

      const isPasswordCorrect = await verifyPassword(password, user.password);
      if (!isPasswordCorrect) {
        throw boom.unauthorized("Error wrong email or password");
      }

      const token = generateAccessToken(user);
      const userWithoutPassword = omitFields(user, ["password"]);
      response.status(200).json({ user: userWithoutPassword, token });
    } catch (error) {
      next(error);
    }
  };

  register = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { fullName, password, email } = request.body;
      if (!fullName || !password || !email) {
        throw boom.badRequest("All fields are necessary");
      }

      const user = await this.userModel.getByEmail(email);

      if (user) {
        throw boom.badRequest("email or password wrong");
      }
      const passwordHash = await hashPassword(password);
      const newUser = await this.userModel.create({
        full_name: fullName,
        password: passwordHash,
        email
      });

      const token = generateAccessToken(newUser);
      const userWithoutPassword = omitFields(newUser, ["password"]);
      response.status(201).json({ user: userWithoutPassword, token });
    } catch (error) {
      next(error);
    }
  };

  callbackGithub = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const code = request.query.code;

      if (!code) {
        throw boom.badRequest("Code is missing");
      }

      const tokenResponse: AxiosResponse<{ access_token: string }> =
        await axios({
          method: "POST",

          url: `${githubApiUrl}?client_id=${clientId}&client_secret=${clientSecret}&code=${code}`,

          headers: {
            Accept: "application/json"
          }
        });

      const accessToken = tokenResponse.data.access_token;

      const userResponse: AxiosResponse = await axios({
        method: "GET",
        url: "https://api.github.com/user",
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      const userInfo = userResponse.data;

      response.redirect(
        `${frontendUrl}?access_token=${accessToken}
        &name=${encodeURIComponent(userInfo.name)}
        &email=${encodeURIComponent(userInfo.email)} 
        &picture=${encodeURIComponent(userInfo.avatar_url)}
        `
      );
    } catch (error: unknown) {
      logger.error(`Error occurred: ${error}`);
      next(error);
    }
  };

  callbackGoogle = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const code: string = request.query.code as string;

      if (!code) {
        throw boom.badRequest("Code is missing");
      }

      const data = {
        code,
        client_id: googleClientId,
        client_secret: googleClientSecret,
        redirect_uri: googleRedirectUri,
        grant_type: "authorization_code" as string
      };

      const result: AxiosResponse = await axios({
        method: "POST",
        url: googleApiUrl,
        data: data,
        headers: {
          Accept: "application/json"
        }
      });

      const accessToken = result.data.access_token;

      const userInfoResponse: AxiosResponse = await axios({
        method: "GET",
        url: "https://www.googleapis.com/oauth2/v3/userinfo",
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      const userInfo = userInfoResponse.data;

      response.redirect(
        `${frontendUrl}?access_token=${accessToken}
        &name=${encodeURIComponent(userInfo.name)}
        &email=${encodeURIComponent(userInfo.email)} 
        &picture=${encodeURIComponent(userInfo.picture)}
        `
      );
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        logger.error(`Axios error: ${error.response?.data}`);
        logger.error(`Status code: ${error.response?.status}`);
      } else {
        logger.error(`Error occurred: ${error}`);
      }
      next(error);
    }
  };
}
