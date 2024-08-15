import {
  CreateProductType,
  ProductDocument,
  ProductModelInterface,
  UpdateProductType
} from "../models/mariadb/products"
import { CategoryModelInteface } from "../models/mariadb/category"
import { SupplierModelInterface } from "../models/mariadb/supplier"
import { Request, Response, NextFunction } from "express"
import { CustomError } from "../utils/customError"
import boom from "@hapi/boom"
import { getFilesUrl } from "../utils/imageUrl"

interface productRequest {
  name: string
  description: string | null
  stock: number
  notes: string | null
  price: number
  supplier_id: number
  category_id: number
  sold: number
}

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

  // get a product by id
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

  // get all products
  getAll = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const products = await this.productModel.getAll()
      response.status(200).json(products)
    } catch (error) {
      next(error)
    }
  }

  // create a product
  create = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const { product } = request.body
      const files = request.files
      const images =
        files && Array.isArray(files) ? getFilesUrl(request, files) : []

      await this.checkifCategoryExists(product.category_id)
      await this.checkifSupplierExists(product.supplier_id)

      const createdProduct = await this.createProduct(product, images)

      response.status(201).json({ product: createdProduct })
    } catch (error) {
      next(error)
    }
  }

  // delete a product
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

  // update a product
  update = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const id = parseInt(request.params.id)
      const { product } = request.body
      const files = request.files
      const images =
        files && Array.isArray(files) ? getFilesUrl(request, files) : []

      const db_product = await this.validateProductId(id)

      await this.checkifCategoryExists(product.category_id)
      await this.checkifSupplierExists(product.supplier_id)

      const updatedProduct = await this.updateProduct(
        product,
        db_product,
        images
      )

      response.status(200).json({ product: updatedProduct })
    } catch (error) {
      next(error)
    }
  }

  //  get all products with relations
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

  // get a product by id with relations
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

  /**
   *  Create the product
   * @param product
   * @param images
   * @returns ProductDocument
   */
  private createProduct = async (
    product: productRequest,
    images: string[]
  ): Promise<ProductDocument> => {
    const data = await this.buildProductData(product, images)
    try {
      return await this.productModel.create(data)
    } catch (error) {
      throw boom.badImplementation("Failed to create product")
    }
  }
  /**
   *  Build the product data
   * @param product
   * @param images
   * @returns CreateProductType
   */
  private buildProductData = async (
    product: productRequest,
    images: string[]
  ): Promise<CreateProductType> => {
    const data: CreateProductType = {
      name: product.name,
      description: product.description,
      stock: product.stock,
      notes: product.notes,
      price: product.price,
      supplier_id: product.supplier_id,
      category_id: product.category_id,
      images: images
    }

    return data
  }

  /**
   *  Check if the category exists
   * @param category_id
   */
  private checkifCategoryExists = async (category_id: number) => {
    const category = await this.categoryModel.getById(category_id)
    if (!category) {
      throw CustomError.NotFound("Category id not found")
    }
  }

  /**
   *  Check if the supplier exists
   * @param supplier_id
   */
  private checkifSupplierExists = async (supplier_id: number) => {
    const supplier = await this.supplierModel.getById(supplier_id)
    if (!supplier) {
      throw CustomError.NotFound("Supplier id not found")
    }
  }

  /**
   *  Validate the product id
   * @param id
   * @returns ProductDocument
   */
  private validateProductId = async (id: number): Promise<ProductDocument> => {
    const product = await this.productModel.getById(id)
    if (!product) {
      throw CustomError.NotFound("Product not found")
    }
    return product
  }

  /**
   *  Prepare the update product data
   * @param product
   * @param db_product
   * @param images
   * @returns productDocument
   */
  private async updateProduct(
    product: productRequest,
    db_product: ProductDocument,
    images: string[]
  ): Promise<ProductDocument> {
    const data = this.prepareUpdateProductData(product, db_product, images)

    const updatedProduct = await this.productModel.update(data)

    return updatedProduct
  }

  /**
   *  Prepare the update product data
   * @param product
   * @param db_product
   * @param images
   * @returns updateProductType
   */
  private prepareUpdateProductData = (
    product: productRequest,
    db_product: ProductDocument,
    images: string[]
  ): UpdateProductType => {
    const data: UpdateProductType = {
      id: db_product.id,
      name: product.name || db_product.name,
      description: product.description || db_product.description,
      stock: product.stock,
      notes: product.notes || db_product.notes,
      price: product.price || db_product.price,
      supplier_id: product.supplier_id,
      sold: product.sold,
      images:
        db_product.images.length > 0
          ? [...db_product.images, ...images]
          : images
    }

    return data
  }
}
