import Router from "express";
import { AuthController } from "../controllers/auth";
import { UserModelInterface } from "../interfaces";

interface CreateAuthRouterProps {
  userModel: UserModelInterface;
}

export const createAuthRouter = ({ userModel }: CreateAuthRouterProps) => {
  const authRouter = Router();
  const authController = new AuthController({ userModel });

  authRouter.post("/login", authController.login);
  authRouter.post("/register", authController.register);
  authRouter.get("/callback/github/", authController.callbackGithub);
  authRouter.get("/callback/google", authController.callbackGoogle);

  return authRouter;
};
