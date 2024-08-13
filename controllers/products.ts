import {
  CreateProductType,
  ProductModelInterface,
  UpdateProductType
} from "../models/mariadb/products"
import { CategoryModelInteface } from "../models/mariadb/category"
import { SupplierModelInterface } from "../models/mariadb/supplier"
import { Request, Response, NextFunction } from "express"
import { CustomError } from "../utils/customError"

export class ProductController {
  private productModel: ProductModelInterface
  private categoryModel: CategoryModelInteface
  private supplierModel: SupplierModelInterface

  constructor({
    productModel,
    categoryModel,
    supplierModel
  }: {
    productModel: ProductModelInterface
    categoryModel: CategoryModelInteface
    supplierModel: SupplierModelInterface
  }) {
    this.categoryModel = categoryModel
    this.productModel = productModel
    this.supplierModel = supplierModel
  }

  getById = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const id = parseInt(request.params.id)

      if (isNaN(id)) {
        throw CustomError.Unauthorized("Id product is missing")
      }

      const product = await this.productModel.getById(id)

      if (!product) {
        throw CustomError.NotFound("Product not found")
      }

      response.status(200).json(product)
    } catch (error) {
      next(error)
    }
  }

  getAll = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const products = await this.productModel.getAll()
      response.status(200).json(products)
    } catch (error) {
      next(error)
    }
  }

  create = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const {
        name,
        description,
        stock,
        notes,
        price,
        supplier_id,
        category_id
      } = request.body

      if (!name || !stock || !supplier_id || !category_id || !price) {
        throw CustomError.BadRequest("All data is necessary")
      }

      if (!(await this.categoryModel.getById(parseInt(category_id)))) {
        throw CustomError.NotFound("Category id not found")
      }

      if (!(await this.supplierModel.getById(parseInt(supplier_id)))) {
        throw CustomError.NotFound("Supplier id not found")
      }

      const data: CreateProductType = {
        name,
        description,
        stock: parseInt(stock),
        notes,
        price: parseFloat(price),
        supplier_id: parseInt(supplier_id),
        category_id: parseInt(category_id)
      }

      const product = await this.productModel.create(data)

      response.status(200).json({ product: product })
    } catch (error) {
      next(error)
    }
  }

  delete = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const id = parseInt(request.params.id)

      if (isNaN(id)) {
        throw CustomError.Unauthorized("Id product is missing")
      }

      if (!(await this.productModel.getById(id))) {
        throw CustomError.NotFound("Product not found")
      }

      await this.productModel.delete(id)

      response.status(200).json({ msg: "Prodcut deleted successfully" })
    } catch (error) {
      next(error)
    }
  }

  update = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const id = parseInt(request.params.id)

      if (isNaN(id)) {
        throw CustomError.Unauthorized("Id product is missing")
      }

      if (!(await this.productModel.getById(id))) {
        throw CustomError.NotFound("Product not found")
      }

      const {
        name,
        description,
        stock,
        notes,
        price,
        supplier_id,
        category_id,
        sold
      } = request.body

      if (category_id) {
        if (!(await this.categoryModel.getById(parseInt(category_id)))) {
          throw CustomError.NotFound("Category id not found")
        }
      }

      if (supplier_id) {
        if (!(await this.supplierModel.getById(parseInt(supplier_id)))) {
          throw CustomError.NotFound("Supplier id not found")
        }
      }

      const data: UpdateProductType = {
        id,
        name,
        description,
        stock: parseInt(stock),
        notes,
        price: parseFloat(price),
        supplier_id: parseInt(supplier_id),
        category_id: parseInt(category_id),
        sold: parseInt(sold)
      }

      const product = await this.productModel.update(data)

      response.status(200).json({ product: product })
    } catch (error) {
      next(error)
    }
  }

  getAllWithRelations = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const products = await this.productModel.getAllWithRelations()
      response.status(200).json(products)
    } catch (error) {
      next(error)
    }
  }

  getByIdWithRelations = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const id = parseInt(request.params.id)

      if (isNaN(id)) {
        throw CustomError.Unauthorized("Id product is missing")
      }

      const product = await this.productModel.getByIdWithRelations(id)

      if (!product) {
        throw CustomError.NotFound("Product not found")
      }

      response.status(200).json(product)
    } catch (error) {
      next(error)
    }
  }
}
