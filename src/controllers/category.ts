import { NextFunction, Request, Response } from "express";
import { CreateCategoryType, UpdateCategoryType } from "../interfaces";
import { CategoryModelInterface } from "../interfaces";
import boom from "@hapi/boom";

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

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      if (!id) {
        throw boom.unauthorized("Invalid category ID");
      }

      const category = await this.categoryModel.getById(id);

      if (!category) {
        throw boom.notFound("Category not found");
      }

      res.status(200).json({ category });
    } catch (error) {
      next(error);
    }
  }


  getByName = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const name = req.params.name;
      if (!name) {
        throw boom.unauthorized("Invalid category name");
      }

      const category = await this.categoryModel.getByName(name);

      if (!category) {
        throw boom.notFound("Category not found");
      }

      res.status(200).json({ category });
    } catch (error) {
      next(error);
    }
  }


  getByDescription = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const description = req.params.description;
      if (!description) {
        throw boom.unauthorized("Invalid category description");
      }

      const category = await this.categoryModel.getByDescription(description);

      if (!category) {
        throw boom.notFound("Category not found");
      }

      res.status(200).json({ category });
    } catch (error) {
      next(error);
    }
  }

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

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;

      if (!id) {
        throw boom.unauthorized("Invalid category ID");
      }

      const category = await this.categoryModel.getById(id);

      if (!category) {
        throw boom.notFound("Category not found");
      }

      await this.categoryModel.delete(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;

      if (!id) {
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
