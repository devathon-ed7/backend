import boom from "@hapi/boom";
import dotenv from "dotenv";
import { Body, Controller, Post, Query, Response, Route, Tags } from "tsoa";
import { AuthService } from "../services/auth-service";
import {
  SignInRequest,
  SignInResponse,
  SignUpRequest,
  SignUpResponse
} from "../interfaces";

dotenv.config();

const frontendUrl = process.env.FRONTEND_URL;

@Route("api/v1/auth")
@Tags("Auth")
export class AuthController extends Controller {
  private authService: AuthService;

  constructor() {
    super();
    this.authService = new AuthService();
  }

  @Post("/signin")
  @Response<SignInResponse>(200, "OK")
  public async signIn(
    @Body() requestBody: SignInRequest
  ): Promise<SignInResponse> {
    const { email, password } = requestBody;
    if (!email || !password) {
      throw boom.badRequest("All fields are necessary");
    }
    const response = await this.authService.signIn(email, password);
    return response;
  }

  @Post("/signup")
  @Response<SignUpResponse>(201, "OK")
  public async signUp(
    @Body() requestBody: SignUpRequest
  ): Promise<SignUpResponse> {
    const { email, password, name } = requestBody;
    if (!name || !password || !email) {
      throw boom.badRequest("All fields are necessary");
    }
    const token = await this.authService.signUp(email, password, name);
    return { token: token };
  }

  @Post("/callback/github")
  @Response(302, "Redirect")
  public async github(@Query() code: string): Promise<void> {
    if (!code) {
      throw boom.badRequest("Code is missing");
    }

    const { accessToken, userInfo } = await this.authService.github(code);

    const redirectUrl = `${frontendUrl}?access_token=${accessToken}&name=${encodeURIComponent(
      userInfo.name
    )}&email=${encodeURIComponent(userInfo.email)}&image=${encodeURIComponent(
      userInfo.avatar_url
    )}`;

    this.setStatus(302);
    this.setHeader("Location", redirectUrl);
  }

  @Post("/callback/google")
  @Response(302, "Redirect")
  public async google(@Query() code: string): Promise<void> {
    if (!code) {
      throw boom.badRequest("Code is missing");
    }
    const { accessToken, userInfo } = await this.authService.google(code);

    const redirectUrl = `${frontendUrl}?access_token=${accessToken}&name=${encodeURIComponent(
      userInfo.name
    )}&email=${encodeURIComponent(userInfo.email)}&image=${encodeURIComponent(
      userInfo.picture
    )}`;

    this.setStatus(302);
    this.setHeader("Location", redirectUrl);
  }
}
