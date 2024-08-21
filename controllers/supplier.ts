import { NextFunction, Request, Response } from "express"
import {
  CreateSupplierType,
  SupplierModelInterface,
  UpdateSupplierType
} from "../interfaces"
import boom from "@hapi/boom"

export class SupplierController {
  private supplierModel: SupplierModelInterface
  constructor({ supplierModel }: { supplierModel: SupplierModelInterface }) {
    this.supplierModel = supplierModel
  }

  getAll = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const suppliers = await this.supplierModel.getAll()
      res.status(200).json(suppliers)
    } catch (error) {
      next(error)
    }
  }

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id, 10)

      if (isNaN(id)) {
        throw boom.unauthorized("Invalid supplier ID")
      }

      const supplier = await this.supplierModel.getById(id)

      if (!supplier) {
        throw boom.notFound("Supplier not found")
      }
      res.status(200).json(supplier)
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

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id)

      if (isNaN(id)) {
        throw boom.unauthorized("Invalid supplier ID")
      }

      const supplier = await this.supplierModel.getById(id)
      if (!supplier) {
        throw boom.notFound("Supplier not found")
      }

      await this.supplierModel.delete(id)
      res.status(204).json({ message: "Supplier deleted successfully" })
    } catch (error) {
      next(error)
    }
  }

  getByName = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const name: string = req.params.name

      if (!name) {
        throw boom.badRequest("All data is required")
      }

      const supplier = await this.supplierModel.getByName(name)

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
      const location: string = req.params.location

      if (!location) {
        throw boom.badRequest("All data is required")
      }

      const supplier = await this.supplierModel.getByLocation(location)

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
      const contact: string = req.params.contact

      if (!contact) {
        throw boom.badRequest("All data is required")
      }

      const supplier = await this.supplierModel.getByContact(contact)

      if (!supplier) {
        throw boom.notFound("Supplier not found")
      }

      res.status(200).json(supplier)
    } catch (error) {
      next(error)
    }
  }
}
