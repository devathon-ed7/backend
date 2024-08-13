import express, { type Express } from "express"

// Configs
import bodyParser from "body-parser"
import cors from "cors"
import middleware from "./utils/middleware"

// Router
import { createUserRouter } from "./routes/user"
import { createAuthRouter } from "./routes/auth"
import { createSupplierRouter } from "./routes/supplier"
import { createCategoryRoutes } from "./routes/category"
import { createRoleRouter } from "./routes/role"
import { createPermissionRouter } from "./routes/permision"
import { CreateRolePersmissionRoutes } from "./routes/RolePermision"
import { createDetailsRouter } from "./routes/details"
import { CreateProductRouter } from "./routes/products"

// Swagger
import swagger from "./swagger"

// Models
import UserModel from "./models/mariadb/user"
import SupplierModel from "./models/mariadb/supplier"
import CategoryModel from "./models/mariadb/category"
import RoleModel from "./models/mariadb/roles"
import PermissionModel from "./models/mariadb/permission"
import RolePermissionModel from "./models/mariadb/RolePersmission"
import DetailsModel from "./models/mariadb/details"
import ProductModel from "./models/mariadb/products"

const app: Express = express()
swagger(app)
const API_VERSION = "/api/v1"

app.use(cors({ credentials: true, origin: true }))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.disable("x-powered-by")
app.set("view engine", "ejs")

// Routes
app.use(`${API_VERSION}/auth`, createAuthRouter({ userModel: UserModel }))
app.use(
  `${API_VERSION}/users`,
  middleware.userExtractor,
  createUserRouter({ userModel: UserModel })
)
app.use(
  `${API_VERSION}/suppliers`,
  middleware.userExtractor,
  createSupplierRouter({ supplierModel: SupplierModel })
)
app.use(
  `${API_VERSION}/permissions`,
  middleware.userExtractor,
  createPermissionRouter({ permissionModel: PermissionModel })
)
app.use(
  `${API_VERSION}/categories`,
  middleware.userExtractor,
  createCategoryRoutes({ categoryModel: CategoryModel })
)
app.use(
  `${API_VERSION}/roles`,
  middleware.userExtractor,
  createRoleRouter({ roleModel: RoleModel })
)
app.use(
  `${API_VERSION}/role-permission`,
  middleware.userExtractor,
  CreateRolePersmissionRoutes({ rolePermissionModel: RolePermissionModel })
)

app.use(
  `${API_VERSION}/details`,
  middleware.userExtractor,
  createDetailsRouter({
    detailsModel: DetailsModel,
    userModel: UserModel,
    roleModel: RoleModel
  })
)

app.use(
  `${API_VERSION}/products`,
  middleware.userExtractor,
  CreateProductRouter({
    categoryModel: CategoryModel,
    supplierModel: SupplierModel,
    productModel: ProductModel
  })
)

// Middlewares
app.use(middleware.boomErrorHandler)
app.use(middleware.errorHandler)
app.use(middleware.unknownEndpoint)

export default app
