import { Router } from "express";
import { CategoryController } from "../controllers/category-controller";
import { SortOrder } from "../interfaces";
import { validatorHandler } from "../utils/validatorHandler";
import categorySchemas from "../schemas/category-schema";

export const CategoryRoutes = () => {
  const categoryRouter = Router();
  const categoryController = new CategoryController();

  categoryRouter.get("/", (req, res, next) => {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const sortBy = req.query.sortBy ? (req.query.sortBy as string) : "name";
    const order = req.query.order ? (req.query.order as SortOrder) : "asc";
    categoryController
      .getAll(page, limit, sortBy, order)
      .then((result) => res.send(result))
      .catch(next);
  });

  categoryRouter.get(
    "/:id",
    validatorHandler(categorySchemas.get, "params"),
    categoryController.getById
  );

  categoryRouter.get(
    "/name/:name",
    validatorHandler(categorySchemas.get, "params"),
    categoryController.getByName
  );

  categoryRouter.get(
    "/description/:description",
    validatorHandler(categorySchemas.get, "params"),
    categoryController.getByDescription
  );

  categoryRouter.post(
    "/",
    validatorHandler(categorySchemas.create, "body"),
    (req, res, next) =>
      categoryController
        .create(req.body)
        .then((result) => res.send(result))
        .catch(next)
  );

  categoryRouter.delete(
    "/:id",
    validatorHandler(categorySchemas.delete, "params"),
    (req, res, next) =>
      categoryController
        .delete(req.params.id)
        .then((result) => res.send(result))
        .catch(next)
  );

  categoryRouter.put(
    "/:id",
    validatorHandler(categorySchemas.get, "params"),
    validatorHandler(categorySchemas.update, "body"),
    (req, res, next) =>
      categoryController
        .update(req.params.id, req.body)
        .then((result) => res.send(result))
        .catch(next)
  );

  return categoryRouter;
};
