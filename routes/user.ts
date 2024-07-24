import Router from 'express'
import { UserController } from '../controllers/user'


export const createUserRouter = ({ userModel }) => {

    const userRouter = Router()
    const userController = new UserController({ userModel })

    /**
     * @swagger
     * /api/v1/users:
     *   get:
     *     summary: Get user
     *     description: Retrieves the authenticated user.
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
    userRouter.get('/', userController.getAll)
    userRouter.get('/:id', userController.getById)

    return userRouter
}


