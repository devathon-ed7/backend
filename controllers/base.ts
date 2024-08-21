import { type Response, type NextFunction } from "express"
import { CategoryModelInterface, SupplierModelInterface } from "../interfaces"

interface ModelWithGetAll<T> {
  getAll: () => Promise<T[]>
}

export class BaseController {
  protected categoryModel: CategoryModelInterface
  protected supplierModel: SupplierModelInterface

  constructor({
    categoryModel = {} as CategoryModelInterface,
    supplierModel = {} as SupplierModelInterface
  }: {
    categoryModel?: CategoryModelInterface
    supplierModel?: SupplierModelInterface
  }) {
    this.categoryModel = categoryModel
    this.supplierModel = supplierModel
  }

  /**
   * Generic function to get data from a model
   * @param model - The model from which the data will be obtained
   * @param res - The response object
   * @param next - The next function to handle errors
   */
  protected async getAllData<T>(
    model: ModelWithGetAll<T>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const data = await model.getAll()
      res.status(200).json(data)
    } catch (error) {
      next(error)
    }
  }
}
