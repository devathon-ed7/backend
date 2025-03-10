import { Router } from "express"

import { ProductController } from "../controllers/products"
import {
  CategoryModelInterface,
  ProductModelInterface,
  SupplierModelInterface
} from "../interfaces"

type CreateProductRouterProps = {
  categoryModel: CategoryModelInterface
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

  productRouter.get("/page/:page/", productController.getByPage)
  productRouter.get("/relations", productController.getAllWithRelations)
  productRouter.get("/relations/:id", productController.getByIdWithRelations)
  productRouter.delete("/:id", productController.delete)
  productRouter.put("/:id", productController.update)
  productRouter.get("/:id", productController.getById)
  productRouter.get("/", productController.getAll)
  productRouter.post("/", productController.create)

  return productRouter
}
