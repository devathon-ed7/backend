import { NextFunction, Request, Response } from "express"
import { CreateCategoryType, UpdateCategoryType } from "../interfaces"
import { CategoryModelInterface } from "../interfaces"
import boom from "@hapi/boom"
import {
  deleteEntity,
  getAllEntities,
  getByNumberParam,
  getByStringParam
} from "../utils/controllerUtils"

export class CategoryController {
  private categoryModel: CategoryModelInterface

  constructor({ categoryModel }: { categoryModel: CategoryModelInterface }) {
    this.categoryModel = categoryModel
  }

  getAll = async (req: Request, res: Response, next: NextFunction) =>
    await getAllEntities(req, res, next, this.categoryModel, "categories")

  getById = async (req: Request, res: Response, next: NextFunction) =>
    await getByNumberParam(
      req,
      res,
      next,
      this.categoryModel.getById,
      "categories",
      "id",
      "number"
    )

  getByName = async (req: Request, res: Response, next: NextFunction) =>
    await getByStringParam(
      req,
      res,
      next,
      this.categoryModel.getByName,
      "categories",
      "name"
    )

  getByDescription = async (req: Request, res: Response, next: NextFunction) =>
    await getByStringParam(
      req,
      res,
      next,
      this.categoryModel.getByDescription,
      "categories",
      "description"
    )

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, description }: CreateCategoryType = req.body

      if (!name || !description) {
        throw boom.badRequest("All data is required")
      }

      const newCategory: CreateCategoryType = {
        name: name,
        description: description
      }

      const category = await this.categoryModel.create(newCategory)

      res
        .status(201)
        .json({ message: "Category created successfully", category: category })
    } catch (erorr) {
      next(erorr)
    }
  }

  delete = (req: Request, res: Response, next: NextFunction) =>
    deleteEntity(req, res, next, this.categoryModel, "category")

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id, 10)

      if (isNaN(id)) {
        throw boom.unauthorized("Invalid category ID")
      }

      const category = await this.categoryModel.getById(id)

      if (!category) {
        throw boom.notFound("Category not found")
      }

      const { name, description }: UpdateCategoryType = req.body

      const data: UpdateCategoryType = {
        name,
        description,
        id: id
      }

      const updatedCategory = await this.categoryModel.update(data)

      res.status(204).json({ category: updatedCategory })
    } catch (error) {
      next(error)
    }
  }
}
