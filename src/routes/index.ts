import { Express } from "express";
//routers
import { AuthRouter } from "./auth-router";
import { CategoryRoutes } from "./category-router";
import { ProductRouter } from "./products";
import { SupplierRouter } from "./supplier";
import { TransactionRouter } from "./transaction";
import { UserRouter } from "./user-router";
//models
import SupplierModel from "../models/supplier";
import CategoryModel from "../models/category";
import ProductModel from "../models/products";
import TransactionModel from "../models/transaction";
import middleware from "../utils/middleware";

export const registerRoutes = (app: Express, API_VERSION: string) => {
  app.use(`${API_VERSION}/users`, middleware.userExtractor, UserRouter());
  app.use(`${API_VERSION}/auth`, AuthRouter());
  app.use(
    `${API_VERSION}/suppliers`,
    SupplierRouter({ supplierModel: SupplierModel })
  );
  app.use(
    `${API_VERSION}/categories`,
    CategoryRoutes({ categoryModel: CategoryModel })
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
  );
};
