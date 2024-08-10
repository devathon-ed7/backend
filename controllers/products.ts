import { ProductModelInterface } from "../models/mariadb/products"
import { CategoryModelInteface } from "../models/mariadb/category"
import { SupplierModelInterface } from "../models/mariadb/supplier"
import { Request, Response, NextFunction } from "express"

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
}
