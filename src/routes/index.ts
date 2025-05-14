import { Express } from "express";
//routers
import { AuthRouter } from "./auth-router";
import { CategoryRoutes } from "./category-router";
import { UserRouter } from "./user-router";

import middleware from "../utils/middleware";

export const registerRoutes = (app: Express, API_VERSION: string) => {
  app.use(`${API_VERSION}/auth`, AuthRouter());
  app.use(`${API_VERSION}/users`, middleware.userExtractor, UserRouter());

  app.use(
    `${API_VERSION}/categories`,
    middleware.userExtractor,
    CategoryRoutes()
  );

  /*app.use(
    `${API_VERSION}/suppliers`,
    SupplierRouter({ supplierModel: SupplierModel })
  );
  

  app.use(
    `${API_VERSION}/products`,
    ProductRouter({
      categoryModel: CategoryModel,
      supplierModel: SupplierModel,
      productModel: ProductModel
    })
  );
  app.use(
    `${API_VERSION}/transactions`,
    TransactionRouter({ transactionModel: TransactionModel })
  );*/
};
