import { NextFunction, Request, Response } from "express"
import {
  CreateSupplierType,
  SupplierModelInterface,
  UpdateSupplierType
} from "../interfaces"
import boom from "@hapi/boom"
import {
  deleteEntity,
  getAllEntities,
  validateParam
} from "../utils/controllerUtils"

export class SupplierController {
  private supplierModel: SupplierModelInterface
  constructor({ supplierModel }: { supplierModel: SupplierModelInterface }) {
    this.supplierModel = supplierModel
  }

  getAll = async (_req: Request, res: Response, next: NextFunction) =>
    await getAllEntities(_req, res, next, this.supplierModel, "supplier")

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = validateParam(req, "id", "number")
      const supplier = await this.supplierModel.getById(id as number)

      if (!supplier) {
        throw boom.notFound("Supplier not found")
      }
      res.status(200).json({ supplier: supplier })
    } catch (error) {
      next(error)
    }
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, location, contact } = req.body

      if (!name || !location || !contact) {
        throw boom.badRequest("All data is required")
      }

      const newSupplier: CreateSupplierType = {
        name: name,
        location: location,
        contact: contact
      }

      const supplier = await this.supplierModel.create(newSupplier)

      res
        .status(201)
        .json({ message: "Supplier created successfully", supplier: supplier })
    } catch (erorr) {
      next(erorr)
    }
  }

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id)

      if (isNaN(id)) {
        throw boom.unauthorized("Invalid supplier ID")
      }

      const supplier = await this.supplierModel.getById(id)
      if (!supplier) {
        throw boom.notFound("Supplier not found")
      }

      const { name, location, contact }: UpdateSupplierType = req.body
      const data: UpdateSupplierType = {
        id: id,
        name,
        location,
        contact
      }

      const updatedSupplier = await this.supplierModel.update(data)

      res.status(204).json({ supplier: updatedSupplier })
    } catch (error) {
      next(error)
    }
  }

  delete = async (req: Request, res: Response, next: NextFunction) =>
    deleteEntity(req, res, next, this.supplierModel, "supplier")

  getByName = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const name = validateParam(req, "name")
      const supplier = await this.supplierModel.getByName(name as string)

      if (!supplier) {
        throw boom.notFound("Supplier not found")
      }

      res.status(200).json(supplier)
    } catch (error) {
      next(error)
    }
  }

  getByLocation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const location = validateParam(req, "location")

      const supplier = await this.supplierModel.getByLocation(
        location as string
      )

      if (!supplier) {
        throw boom.notFound("Supplier not found")
      }

      res.status(200).json(supplier)
    } catch (error) {
      next(error)
    }
  }

  getByContact = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const contact = validateParam(req, "contact")

      const supplier = await this.supplierModel.getByContact(contact as string)

      if (!supplier) {
        throw boom.notFound("Supplier not found")
      }

      res.status(200).json(supplier)
    } catch (error) {
      next(error)
    }
  }
}
