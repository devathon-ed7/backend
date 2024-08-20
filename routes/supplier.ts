import Router from "express"
import { SupplierController } from "../controllers/supplier"
import { SupplierModelInterface } from "../models/mariadb/supplier"

interface CreateSupplierRouterProps {
  supplierModel: SupplierModelInterface
}

export const createSupplierRouter = ({
  supplierModel
}: CreateSupplierRouterProps) => {
  const supplierRouter = Router()
  const supplierController = new SupplierController({ supplierModel })

  supplierRouter.get("/:id", supplierController.getById)
  supplierRouter.post("/", supplierModel.create)
  supplierRouter.put("/update/:id", supplierController.update)
  supplierRouter.delete("/delete/:id", supplierController.delete)
  supplierRouter.get("/", supplierController.getAll)
  supplierRouter.get("/name/:name", supplierController.getByName)
  supplierRouter.get("/location/:location", supplierController.getByLocation)
  supplierRouter.get("/contact/:contact", supplierController.getByContact)

  return supplierRouter
}
