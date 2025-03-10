import { Router } from "express"
import { CategoryModelInterface } from "../interfaces"
import { CategoryController } from "../controllers/category"

interface createCategoryRoutesProps {
  categoryModel: CategoryModelInterface
}

export const createCategoryRoutes = ({
  categoryModel
}: createCategoryRoutesProps) => {
  const categoryRouter = Router()
  const categoryController = new CategoryController({ categoryModel })

  categoryRouter.get("/", categoryController.getAll)
  categoryRouter.get("/:id", categoryController.getById)
  categoryRouter.get("/name/:name", categoryController.getByName)
  categoryRouter.get(
    "/description/:description",
    categoryController.getByDescription
  )
  categoryRouter.post("/", categoryController.create)
  categoryRouter.delete("/:id", categoryController.delete)
  categoryRouter.put("/:id", categoryController.update)

  return categoryRouter
}
