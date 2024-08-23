import swaggerJsDoc from "swagger-jsdoc"
import swaggerUi from "swagger-ui-express"
import { Express } from "express"

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Inventory System API",
      version: "1.0.0",
      description: ""
    },
    servers: [
      {
        url: "http://localhost:3000"
      }
    ]
  },
  apis: ["openapi.yaml"]
}

const specs = swaggerJsDoc(options)

export default (app: Express) => {
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs, {
      tryItOutEnabled: true
    })
  )
}
