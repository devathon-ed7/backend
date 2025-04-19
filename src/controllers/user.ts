import { NextFunction, Request, Response } from "express";
import { hashPassword } from "../utils/password-utils";
import boom from "@hapi/boom";
import { SortOrder } from "../interfaces";
import {
  UserModelInterface
} from "../interfaces";


export class UserController {
  private userModel: UserModelInterface;

  constructor({
    userModel
  }: {
    userModel: UserModelInterface;
  }) {
    this.userModel = userModel;
  }

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const sortBy = (req.query.sortBy as string) || "id";
      const order = (req.query.order as SortOrder) || "asc";
      const [users, totalUsers] = await Promise.all([
        this.userModel.getAll(page, limit, sortBy, order),
        this.userModel.count()
      ]);

      const totalPages = Math.ceil(totalUsers / limit);

      res.status(200).json({
        users,
        totalUsers,
        totalPages,
        currentPage: page,
        sort: {
          sortBy,
          order
        }
      });
    } catch (error) {
      next(error);
    }
  };

  getById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.params.id;

      if (!userId) {
        throw boom.unauthorized("Invalid user ID");
        return;
      }

      const existingUser = await this.userModel.getById(userId);
      if (!existingUser) {
        throw boom.notFound("User not found");
        return;
      }

      res.status(200).json({ user: existingUser });
    } catch (error) {
      next(error);
    }
  };

  create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      //asuming the image field is only other url to the image 
      const { user } = req.body;

      const emailExists = await this.checkIfEmailExists(user.email);
      if (emailExists) {
        throw boom.conflict("User could not be created");
      }

      const hashedPassword = await hashPassword(user.password);

      const createdUser = await this.userModel.create({
        email: user.email,
        password: hashedPassword,
        name: user.name
      });

      if (!createdUser) {
        throw boom.badImplementation("User could not be created");
      }


      res.status(201).json({
        message: "User created successfully",
        newUser: createdUser
      });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id
      if (!id) {
        throw boom.badRequest("Invalid ID")
      }

      const existingUser = await this.userModel.getById(id)
      if (!existingUser) {
        throw boom.notFound(`User not found`)
      }

      await this.userModel.delete(id)
      res.status(204).send()
    } catch (error) {
      next(error)
    }
  }

  update = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.params.id;
      const { user } = req.body;

      const existingUser = await this.userModel.getById(userId);
      if (!existingUser) {
        throw boom.notFound("User not found");
        return;
      }
      const updatedUser = await this.userModel.update(user);



      res
        .status(200)
        .json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
      next(error);
    }
  };

  private checkIfEmailExists = async (email: string): Promise<boolean> => {
    const existingUser = await this.userModel.getByEmail(email);
    if (existingUser) {
      return true;
    }
    return false;
  };
}
