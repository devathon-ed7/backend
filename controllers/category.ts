import { NextFunction, Request, Response } from "express"
import { CustomError } from "../utils/customError"
import {
  CreateCategoryType,
  UpdateCategoryType
} from "../models/mariadb/category"
import { CategoryModelInterface } from "../interfaces"
import { BaseController } from "./base"
import { deleteEntity } from "../utils/controllerUtils"

export class CategoryController extends BaseController {
  protected categoryModel: CategoryModelInterface

  constructor({ categoryModel }: { categoryModel: CategoryModelInterface }) {
    super({ categoryModel })
    this.categoryModel = categoryModel
  }

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categories = await this.categoryModel.getAll()
      res.status(200).json(categories)
    } catch (error) {
      next(error)
    }
  }

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id, 10)

      if (isNaN(id)) {
        throw CustomError.Unauthorized("Invalid category ID")
      }

      const category = await this.categoryModel.getById(id)

      if (!category) {
        throw CustomError.NotFound("Category not found")
      }
      res.status(200).json(category)
    } catch (error) {
      next(error)
    }
  }

  getByName = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const name = req.params.name

      if (!name) {
        throw CustomError.Unauthorized("Invalid category name")
      }

      const category = await this.categoryModel.getByName(name)

      if (category.length == 0) {
        throw CustomError.NotFound("Category not found")
      }
      res.status(200).json(category)
    } catch (error) {
      next(error)
    }
  }

  getByDescription = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const description = req.params.description

      if (!description) {
        throw CustomError.Unauthorized("Invalid category Description")
      }

      const category = await this.categoryModel.getByDescription(description)

      if (category.length == 0) {
        throw CustomError.NotFound("Category not found")
      }
      res.status(200).json(category)
    } catch (error) {
      next(error)
    }
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, description }: CreateCategoryType = req.body

      if (!name || !description) {
        throw CustomError.BadRequest("All data is required")
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

  delete = (req: Request, res: Response, next: NextFunction) => {
    return deleteEntity(
      req,
      res,
      next,
      this.categoryModel.getById.bind(this.categoryModel),
      this.categoryModel.delete.bind(this.categoryModel),
      "category"
    )
  }

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id, 10)

      if (isNaN(id)) {
        throw CustomError.Unauthorized("Invalid category ID")
      }

      const category = await this.categoryModel.getById(id)

      if (!category) {
        throw CustomError.NotFound("Category not found")
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
