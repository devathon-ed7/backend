import { NextFunction, Request, Response } from "express"
import {
  CreateSupplierType,
  SortOrder,
  SupplierModelInterface,
  UpdateSupplierType
} from "../interfaces"
import boom from "@hapi/boom"

export class SupplierController {
  private supplierModel: SupplierModelInterface
  constructor({ supplierModel }: { supplierModel: SupplierModelInterface }) {
    this.supplierModel = supplierModel
  }

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const sort = (req.query.sort as string) || "id";
      const order: SortOrder = (req.query.order as SortOrder) || "asc";
      const [suppliers, totalSuppliers] = await Promise.all([
        this.supplierModel.getAll(page, limit, sort, order),
        this.supplierModel.count()
      ]);
      const totalPages = Math.ceil(totalSuppliers / limit);
      res.status(200).json({
        suppliers,
        totalSuppliers,
        totalPages,
        currentPage: page,
        sort: {
          sortBy: sort,
          order
        }
      });
    } catch (error) {
      next(error);
    }
  }

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      if (!id) {
        throw boom.unauthorized("Invalid supplier ID");
      }
      const supplier = await this.supplierModel.getById(id);
      if (!supplier) {
        throw boom.notFound("Supplier not found");
      }
      res.status(200).json({ supplier });
    } catch (error) {
      next(error);
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
      const id = req.params.id;
      if (!id) {
        throw boom.unauthorized("Invalid supplier ID");
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
      const id = req.params.id;
      if (!id) {
        throw boom.unauthorized("Invalid supplier ID");
      }
      const existingSupplier = await this.supplierModel.getById(id);
      if (!existingSupplier) {
        throw boom.notFound("Supplier not found");
      }
      await this.supplierModel.delete(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  getByName = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const name = req.params.name;
      if (!name) {
        throw boom.unauthorized("Invalid supplier name");
      }
      const supplier = await this.supplierModel.getByName(name);
      if (!supplier) {
        throw boom.notFound("Supplier not found");
      }
      res.status(200).json({ supplier });
    } catch (error) {
      next(error);
    }
  }

  getByLocation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const location = req.params.location;
      if (!location) {
        throw boom.unauthorized("Invalid supplier location");
      }
      const supplier = await this.supplierModel.getByLocation(location);
      if (!supplier) {
        throw boom.notFound("Supplier not found");
      }
      res.status(200).json({ supplier });
    } catch (error) {
      next(error);
    }
  }


  getByContact = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const contact = req.params.contact;
      if (!contact) {
        throw boom.unauthorized("Invalid supplier contact");
      }
      const supplier = await this.supplierModel.getByContact(contact);
      if (!supplier) {
        throw boom.notFound("Supplier not found");
      }
      res.status(200).json({ supplier });
    } catch (error) {
      next(error);
    }
  }
}
