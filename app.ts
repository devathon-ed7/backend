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
import { createTransactionRouter } from "./routes/transaction"

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
import TransactionModel from "./models/mariadb/transaction"

const app: Express = express()
swagger(app)
const API_VERSION = "/api/v1"

app.use(cors({ credentials: true, origin: true }))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.disable("x-powered-by")
app.set("view engine", "ejs")

// Routes
//auth
app.use(`${API_VERSION}/auth`, createAuthRouter({ userModel: UserModel }))
//users
app.use(
  `${API_VERSION}/users`,
  middleware.userExtractor,
  middleware.upload.single("file"),
  createUserRouter({ userModel: UserModel, detailsModel: DetailsModel })
)
//suppliers
app.use(
  `${API_VERSION}/suppliers`,
  middleware.userExtractor,
  createSupplierRouter({ supplierModel: SupplierModel })
)
//permissions
app.use(
  `${API_VERSION}/permissions`,
  middleware.userExtractor,
  createPermissionRouter({ permissionModel: PermissionModel })
)
//categories
app.use(
  `${API_VERSION}/categories`,
  middleware.userExtractor,
  createCategoryRoutes({ categoryModel: CategoryModel })
)
//roles
app.use(
  `${API_VERSION}/roles`,
  middleware.userExtractor,
  createRoleRouter({ roleModel: RoleModel })
)
//role-permission
app.use(
  `${API_VERSION}/role-permission`,
  middleware.userExtractor,
  CreateRolePersmissionRoutes({ rolePermissionModel: RolePermissionModel })
)
//details
app.use(
  `${API_VERSION}/details`,
  middleware.userExtractor,
  middleware.upload.single("file"),
  createDetailsRouter({
    detailsModel: DetailsModel,
    userModel: UserModel,
    roleModel: RoleModel
  })
)
//products
app.use(
  `${API_VERSION}/products`,
  middleware.userExtractor,
  middleware.upload.single("file"),
  CreateProductRouter({
    categoryModel: CategoryModel,
    supplierModel: SupplierModel,
    productModel: ProductModel
  })
)

//transactions
app.use(
  `${API_VERSION}/transactions`,
  middleware.userExtractor,
  createTransactionRouter({ transactionModel: TransactionModel })
)

//static files
app.use(express.static("build"))

// Middlewares
app.use(middleware.boomErrorHandler)
app.use(middleware.errorHandler)
app.use(middleware.unknownEndpoint)

export default app
