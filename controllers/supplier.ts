import { NextFunction, Request, Response } from "express"
import {
  CreateSupplierType,
  UpdateSupplierType,
  SupplierModelInterface
} from "../models/mariadb/supplier"
import { CustomError } from "../utils/customError"
import { error } from "console"

export class SupplierController {
  private supplierModel: SupplierModelInterface
  constructor({ supplierModel }: { supplierModel: SupplierModelInterface }) {
    this.supplierModel = supplierModel
  }

  getAll = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const suppliers = await this.supplierModel.getAll()
      response.status(200).json(suppliers)
    } catch (error) {
      next(error)
    }
  }

  getById = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const id = parseInt(request.params.id, 10)

      if (isNaN(id)) {
        throw CustomError.Unauthorized("Invalid supplier ID")
      }

      const supplier = await this.supplierModel.getById(id)

      if (!supplier) {
        throw CustomError.NotFound("Supplier not found")
      }
      response.status(200).json(supplier)
    } catch (error) {
      next(error)
    }
  }

  create = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const { name, location, contact } = request.body

      if (!name || !location || !contact) {
        throw CustomError.BadRequest("All data is required")
      }

      const newSupplier: CreateSupplierType = {
        name: name,
        location: location,
        contact: contact
      }

      const supplier = await this.supplierModel.create(newSupplier)

      response
        .status(201)
        .json({ message: "Supplier created successfully", supplier: supplier })
    } catch (erorr) {
      next(erorr)
    }
  }

  update = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const id = parseInt(request.params.id)

      if (isNaN(id)) {
        throw CustomError.Unauthorized("Invalid supplier ID")
      }

      const supplier = await this.supplierModel.getById(id)
      if (!supplier) {
        throw CustomError.NotFound("Supplier not found")
      }

      const { name, location, contact }: UpdateSupplierType = request.body
      const data: UpdateSupplierType = {
        id: id,
        name,
        location,
        contact
      }

      const updatedSupplier = await this.supplierModel.update(data)

      response.status(204).json({ supplier: updatedSupplier })
    } catch (error) {
      next(error)
    }
  }

  delete = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const id = parseInt(request.params.id)

      if (isNaN(id)) {
        throw CustomError.Unauthorized("Invalid supplier ID")
      }

      const supplier = await this.supplierModel.getById(id)
      if (!supplier) {
        throw CustomError.NotFound("Supplier not found")
      }

      await this.supplierModel.delete(id)
      response.status(204).json({ message: "Supplier deleted successfully" })
    } catch (error) {
      next(error)
    }
  }

  getByName = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const name: string = request.params.name

      if (!name) {
        throw CustomError.BadRequest("All data is required")
      }

      const supplier = await this.supplierModel.getByName(name)

      if (!supplier) {
        throw CustomError.NotFound("Supplier not found")
      }

      response.status(200).json(supplier)
    } catch {
      next(error)
    }
  }

  getByLocation = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const location: string = request.params.location

      if (!location) {
        throw CustomError.BadRequest("All data is required")
      }

      const supplier = await this.supplierModel.getByLocation(location)

      if (!supplier) {
        throw CustomError.NotFound("Supplier not found")
      }

      response.status(200).json(supplier)
    } catch {
      next(error)
    }
  }

  getByContact = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const contact: string = request.params.contact

      if (!contact) {
        throw CustomError.BadRequest("All data is required")
      }

      const supplier = await this.supplierModel.getByContact(contact)

      if (!supplier) {
        throw CustomError.NotFound("Supplier not found")
      }

      response.status(200).json(supplier)
    } catch {
      next(error)
    }
  }
}
