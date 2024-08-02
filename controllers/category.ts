import { NextFunction, Request, Response } from "express"
import { CategoryModelInteface } from "../models/mariadb/category"
import { CustomError } from "../utils/customError"
import {
  CreateCategoryType,
  UpdateCategoryType
} from "../models/mariadb/category"
export class CategoryController {
  private categoryModel: CategoryModelInteface
  constructor({ categoryModel }: { categoryModel: CategoryModelInteface }) {
    this.categoryModel = categoryModel
  }

  getAll = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const categories = await this.categoryModel.getAll()
      response.status(200).json(categories)
    } catch (error) {
      next(error)
    }
  }

  getById = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const id = parseInt(request.params.id, 10)

      if (isNaN(id)) {
        throw CustomError.Unauthorized("Invalid category ID")
      }

      const category = await this.categoryModel.getById(id)

      if (!category) {
        throw CustomError.NotFound("Category not found")
      }
      response.status(200).json(category)
    } catch (error) {
      next(error)
    }
  }

  create = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const { name, description }: CreateCategoryType = request.body

      if (!name || !description) {
        throw CustomError.BadRequest("All data is required")
      }

      const newCategory: CreateCategoryType = {
        name: name,
        description: description
      }

      const category = await this.categoryModel.create(newCategory)

      response
        .status(201)
        .json({ message: "Category created successfully", category: category })
    } catch (erorr) {
      next(erorr)
    }
  }

  delete = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const id = parseInt(request.params.id, 10)
      if (isNaN(id)) {
        throw CustomError.Unauthorized("Invalid category ID")
      }

      const category = await this.categoryModel.getById(id)

      if (!category) {
        throw CustomError.NotFound("Category not found")
      }

      this.categoryModel.delete(id)
      response.status(200).json({ message: "Supplier deleted successfully" })
    } catch (error) {
      next(error)
    }
  }

  update = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const id = parseInt(request.params.id, 10)

      if (isNaN(id)) {
        throw CustomError.Unauthorized("Invalid category ID")
      }

      const category = await this.categoryModel.getById(id)

      if (!category) {
        throw CustomError.NotFound("Category not found")
      }

      const { name, description }: UpdateCategoryType = request.body

      const data: UpdateCategoryType = {
        name,
        description,
        id: id
      }

      const updatedCategory = await this.categoryModel.update(data)

      response.status(200).json({ category: updatedCategory })
    } catch (error) {
      next(error)
    }
  }
}
