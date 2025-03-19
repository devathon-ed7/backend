import { NextFunction, Request, Response } from "express";
import { CreateCategoryType, UpdateCategoryType } from "../interfaces";
import { CategoryModelInterface } from "../interfaces";
import boom from "@hapi/boom";
import {
  deleteEntity,
  getByNumberParam,
  getByStringParam,
  getByStringParamPaginate
} from "../utils/controllerUtils";

export class CategoryController {
  private categoryModel: CategoryModelInterface;

  constructor({ categoryModel }: { categoryModel: CategoryModelInterface }) {
    this.categoryModel = categoryModel;
  }

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const sort = (req.query.sort as string) || "name";

      const offset = (page - 1) * limit;

      const categories = await this.categoryModel.getAll({
        limit,
        offset,
        sort
      });

      const totalCategories = await this.categoryModel.count();
      const totalPages = Math.ceil(totalCategories / limit);

      res.status(200).json({
        categories,
        pagination: {
          totalCategories,
          totalPages,
          currentPage: page,
          limit
        }
      });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) =>
    await getByNumberParam(
      req,
      res,
      next,
      this.categoryModel.getById,
      "categories",
      "id",
      "number"
    );

  getByName = async (req: Request, res: Response, next: NextFunction) =>
    await getByStringParamPaginate(
      req,
      res,
      next,
      this.categoryModel,
      "categories",
      "name"
    );

  getByDescription = async (req: Request, res: Response, next: NextFunction) =>
    await getByStringParam(
      req,
      res,
      next,
      this.categoryModel.getByDescription,
      "categories",
      "description"
    );

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, description }: CreateCategoryType = req.body;

      if (!name || !description) {
        throw boom.badRequest("All data is required");
      }

      const newCategory: CreateCategoryType = {
        name: name,
        description: description
      };

      const category = await this.categoryModel.create(newCategory);

      res
        .status(201)
        .json({ message: "Category created successfully", category: category });
    } catch (erorr) {
      next(erorr);
    }
  };

  delete = (req: Request, res: Response, next: NextFunction) =>
    deleteEntity(req, res, next, this.categoryModel, "category");

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id, 10);

      if (isNaN(id)) {
        throw boom.unauthorized("Invalid category ID");
      }

      const category = await this.categoryModel.getById(id);

      if (!category) {
        throw boom.notFound("Category not found");
      }

      const { name, description }: UpdateCategoryType = req.body;

      const data: UpdateCategoryType = {
        name,
        description,
        id: id
      };

      const updatedCategory = await this.categoryModel.update(data);

      res.status(204).json({ category: updatedCategory });
    } catch (error) {
      next(error);
    }
  };
}
