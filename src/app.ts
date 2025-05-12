import express, { type Express } from "express";
import path from "path";
import { fileURLToPath } from "url";

// Configs
import cors from "cors";
import middleware from "./utils/middleware";

// Router
import { registerRoutes } from "./routes";

import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger/swagger.json";

const app: Express = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const API_VERSION = "/api/v1";

app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.disable("x-powered-by");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
console.log(__dirname);

// Routes
registerRoutes(app, API_VERSION);

//static files
app.use(express.static("build"));

//swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Middlewares
app.use(middleware.boomErrorHandler);
app.use(middleware.errorHandler);
app.use(middleware.unknownEndpoint);

export default app;
