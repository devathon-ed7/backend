import { Router } from "express"
import { ProductModelInterface } from "../models/mariadb/products"
import { CategoryModelInteface } from "../models/mariadb/category"
import { SupplierModelInterface } from "../models/mariadb/supplier"
import { ProductController } from "../controllers/products"

type CreateProductRouterProps = {
  categoryModel: CategoryModelInteface
  productModel: ProductModelInterface
  supplierModel: SupplierModelInterface
}

export const CreateProductRouter = ({
  categoryModel,
  productModel,
  supplierModel
}: CreateProductRouterProps) => {
  const productRouter = Router()
  const productController = new ProductController({
    categoryModel,
    productModel,
    supplierModel
  })
  productRouter.get("/relations", productController.getAllWithRelations)
  productRouter.get("/relations/:id", productController.getByIdWithRelations)
  productRouter.delete("/:id", productController.delete)
  productRouter.put("/:id", productController.update)
  productRouter.get("/:id", productController.getById)
  productRouter.get("/", productController.getAll)
  productRouter.post("/", productController.create)

  return productRouter
}
