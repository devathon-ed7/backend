import boom from "@hapi/boom";
import dotenv from "dotenv";
import { GithubUserInfo, GoogleUserInfo } from "../interfaces";
import { hashPassword, verifyPassword } from "../utils/password-utils";
import { generateAccessToken } from "../utils/middleware";
import axios, { AxiosResponse } from "axios";
import { Singleton } from "typescript-ioc";
import UserModel from "../models/user-model";

dotenv.config();

//github
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const githubApiUrl = process.env.GITHUB_API_URL;
//google
const googleClientId: string = process.env.GOOGLE_CLIENT_ID as string;
const googleClientSecret: string = process.env.GOOGLE_CLIENT_SECRET as string;
const googleApiUrl: string = process.env.GOOGLE_API_URL as string;
const googleRedirectUri: string = process.env.GOOGLE_REDIRECT_URI as string;

@Singleton
export class AuthService {


  public signIn = async (email: string, password: string): Promise<string> => {
    const existingUser = await UserModel.getByEmail(email);

    if (!existingUser || !existingUser.password) {
      throw boom.notFound("Error wrong email or password");
    }

    const isPasswordCorrect = await verifyPassword(password, existingUser.password);
    if (!isPasswordCorrect) {
      throw boom.unauthorized("Error wrong email or password");
    }

    const token = generateAccessToken(existingUser.id);

    return token
  }

  public signUp = async (email: string, password: string, name: string): Promise<string> => {
    const existingUser = await UserModel.getByEmail(email);

    if (existingUser) {
      throw boom.badRequest("Something went wrong");
    }
    const passwordHash = await hashPassword(password);
    const newUser = await UserModel.create({
      name,
      password: passwordHash,
      email
    });

    const token = generateAccessToken(newUser.id);
    return token
  }

  public github = async (code: string): Promise<{ accessToken: string; userInfo: GithubUserInfo }> => {

    const githubResponse: AxiosResponse<{ access_token: string }> =
      await axios({
        method: "POST",

        url: `${githubApiUrl}?client_id=${clientId}&client_secret=${clientSecret}&code=${code}`,

        headers: {
          Accept: "application/json"
        }
      });

    const accessToken = githubResponse.data.access_token;

    const userResponse: AxiosResponse = await axios({
      method: "GET",
      url: "https://api.github.com/user",
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    return { accessToken, userInfo: userResponse.data }
  }

  public google = async (code: string): Promise<{ accessToken: string; userInfo: GoogleUserInfo }> => {
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

    const userResponse: AxiosResponse = await axios({
      method: "GET",
      url: "https://www.googleapis.com/oauth2/v3/userinfo",
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    return {
      accessToken,
      userInfo: userResponse.data
    }
  }
}