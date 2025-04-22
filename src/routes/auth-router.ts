import Router from "express";
import { AuthController } from "../controllers/auth-controller";


export const AuthRouter = () => {
  const authRouter = Router();
  const authController = new AuthController();

  authRouter.post("/signin", (req, res, next) => authController.signIn(req.body).then((result) => res.send(result)).catch(next));
  authRouter.post("/signup", (req, res, next) => authController.signUp(req.body).then((result) => res.send(result)).catch(next));

  authRouter.get("/callback/github/", (req, res) => {
    const code = req.query.code as string;
    if (!code) {
      return res.status(400).send("Code is missing");
    }
    authController.github(code)
  });

  authRouter.get("/callback/google", (req, res) => {
    const code = req.query.code as string;
    if (!code) {
      return res.status(400).send("Code is missing");
    }
    authController.google(code);
  });

  return authRouter;
};
