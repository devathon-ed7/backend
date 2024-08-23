import {
  CreateProductType,
  ProductDocument,
  ProductModelInterface,
  UpdateProductType,
  CategoryModelInterface,
  SupplierModelInterface
} from "../interfaces"
import { Request, Response, NextFunction } from "express"
import boom from "@hapi/boom"
import { getFilesUrl } from "../utils/imageUrl"
import { checkIfExists } from "../utils/modelUtils"
import {
  deleteEntity,
  getAllEntities,
  getByNumberParam
} from "../utils/controllerUtils"

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
  private categoryModel: CategoryModelInterface
  private supplierModel: SupplierModelInterface

  constructor({
    productModel,
    categoryModel,
    supplierModel
  }: {
    productModel: ProductModelInterface
    categoryModel: CategoryModelInterface
    supplierModel: SupplierModelInterface
  }) {
    this.categoryModel = categoryModel
    this.productModel = productModel
    this.supplierModel = supplierModel
  }

  getById = async (req: Request, res: Response, next: NextFunction) =>
    await getByNumberParam(
      req,
      res,
      next,
      this.productModel.getById,
      "product",
      "id",
      "number"
    )

  getByPage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.params.page)
      const limit = parseInt(req.query.limit as string) || 16

      if (!page || page < 1) {
        throw boom.badRequest("The number of page is necessary")
      }

      const skip = (page - 1) * limit
      const take = limit * page

      const products = await this.productModel.getByPage({ skip, take })

      res.status(200).json({ products: products })
    } catch (error) {
      next(error)
    }
  }

  getAll = async (req: Request, res: Response, next: NextFunction) =>
    await getAllEntities(req, res, next, this.productModel, "products")

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { product } = req.body
      const files = req.files
      const images =
        files && Array.isArray(files) ? getFilesUrl(req, files) : []
      await checkIfExists(this.productModel, product.category_id, "Category")
      await checkIfExists(this.productModel, product.supplier_id, "Supplier")

      const createdProduct = await this.createProduct(product, images)

      res.status(201).json({ product: createdProduct })
    } catch (error) {
      next(error)
    }
  }

  delete = async (req: Request, res: Response, next: NextFunction) =>
    deleteEntity(req, res, next, this.productModel, "product")

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id)
      const { product } = req.body
      const files = req.files
      const images =
        files && Array.isArray(files) ? getFilesUrl(req, files) : []

      const db_product = await checkIfExists(this.productModel, id, "Product")
      await checkIfExists(this.productModel, product.category_id, "Category")
      await checkIfExists(this.productModel, product.supplier_id, "Supplier")

      const updatedProduct = await this.updateProduct(
        product,
        db_product,
        images
      )

      res.status(200).json({ product: updatedProduct })
    } catch (error) {
      next(error)
    }
  }

  //  get all products with relations
  getAllWithRelations = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const products = await this.productModel.getAllWithRelations()
      res.status(200).json(products)
    } catch (error) {
      next(error)
    }
  }

  // get a product by id with relations
  getByIdWithRelations = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = parseInt(req.params.id)

      if (isNaN(id)) {
        throw boom.notFound("Product id is missing")
      }

      const product = await this.productModel.getByIdWithRelations(id)

      if (!product) {
        throw boom.notFound("Product not found")
      }

      res.status(200).json(product)
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
      category_id: product.category_id,
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
