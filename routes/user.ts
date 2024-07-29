import Router from "express"
import { UserController } from "../controllers/user"
import { UserModelInterface } from "../models/mariadb/user"

interface CreateUserRouterProps {
  userModel: UserModelInterface
}
export const createUserRouter = ({ userModel }: CreateUserRouterProps) => {
  const userRouter = Router()
  const userController = new UserController({ userModel })

  /**
   * @swagger
   * /api/v1/users:
   *   get:
   *     summary: Get user
   *     description: Retrieves all users.
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Successful response
   *         content:
   *           application/json:
   *             schema:
   *              properties:
   *
   *                  username:
   *                      type: string
   *
   *       400:
   *         description: Unauthorized
   *       404:
   *         description: User not found
   *       500:
   *         description: Internal server error
   */
  userRouter.get("/", userController.getAll)
  /**
   * @swagger
   * /api/v1/users/:id:
   *   get:
   *     summary: Get user by id
   *     description: Retrieves the user.
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Successful response
   *         content:
   *           application/json:
   *             schema:
   *              properties:
   *
   *                  username:
   *                      type: string
   *
   *       400:
   *         description: Unauthorized
   *       404:
   *         description: User not found
   *       500:
   *         description: Internal server error
   */
  userRouter.get("/:id", userController.getById)
  /**
   * @swagger
   * /api/v1/users:
   *   post:
   *     summary: Create user
   *     description: Creates a new user.
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/User'
   *     responses:
   *       '201':
   *         description: Successful response
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 username:
   *                   type: string
   *                 id:
   *                   type: string
   *       '400':
   *         description: Unauthorized
   *       '500':
   *         description: Internal server error
   *
   * components:
   *   schemas:
   *     User:
   *       type: object
   *       required:
   *         - username
   *         - password
   *       properties:
   *         id:
   *           type: integer
   *         username:
   *           type: string
   *         password:
   *           type: string
   */
  userRouter.post("/", userController.create)
  /**
   * @swagger
   * /api/v1/users/{id}:
   *   put:
   *     summary: Update user
   *     description: Updates the user.
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/User'
   *     responses:
   *       '200':
   *         description: Successful response
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 username:
   *                   type: string
   *                 id:
   *                   type: string
   *       '400':
   *         description: Unauthorized
   *       '404':
   *         description: User not found
   *       '500':
   *         description: Internal server error
   */
  userRouter.put("/:id", userController.update)
  /**
   * @swagger
   * /api/v1/users/{id}:
   *   delete:
   *     summary: Delete user
   *     description: Delete the user.
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       '204':
   *         description: Successful response
   *       '400':
   *         description: Unauthorized
   *       '404':
   *         description: User not found
   *       '500':
   *         description: Internal server error
   */
  userRouter.delete("/:id", userController.delete)
  return userRouter
}
