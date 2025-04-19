import express, { type Express } from "express";
import path from "path";
import { fileURLToPath } from "url";

// Configs
import cors from "cors";
import middleware from "./utils/middleware";

// Router
import { registerRoutes } from "./routes";

// Swagger
import swagger from "./swagger";



const app: Express = express();
swagger(app);
const API_VERSION = "/api/v1";

app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.disable("x-powered-by");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
console.log(__dirname);

// Routes
//auth
registerRoutes(app, API_VERSION);

//static files
app.use(express.static("build"));

// Middlewares
app.use(middleware.boomErrorHandler);
app.use(middleware.errorHandler);
app.use(middleware.unknownEndpoint);

export default app;
