import {
  ProductModelInterface,
  CategoryModelInterface,
  SupplierModelInterface,
  SortOrder
} from "../interfaces";
import { Request, Response, NextFunction } from "express";
import boom from "@hapi/boom";



export class ProductController {
  private productModel: ProductModelInterface;
  private categoryModel: CategoryModelInterface;
  private supplierModel: SupplierModelInterface;

  constructor({
    productModel,
    categoryModel,
    supplierModel
  }: {
    productModel: ProductModelInterface;
    categoryModel: CategoryModelInterface;
    supplierModel: SupplierModelInterface;
  }) {
    this.categoryModel = categoryModel;
    this.productModel = productModel;
    this.supplierModel = supplierModel;
  }

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      if (!id) {
        throw boom.unauthorized("Invalid product ID");
      }
      const product = await this.productModel.getById(id);
      if (!product) {
        throw boom.notFound("Product not found");
      }
      res.status(200).json({ product });
    } catch (error) {
      next(error);
    }
  }


  getByPage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.params.page);
      const limit = parseInt(req.query.limit as string) || 16;

      if (!page || page < 1) {
        throw boom.badRequest("The number of page is necessary");
      }

      const skip = (page - 1) * limit;
      const take = limit * page;

      const products = await this.productModel.getByPage({ skip, take });

      res.status(200).json({ products: products });
    } catch (error) {
      next(error);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const sort = (req.query.sort as string) || "id";
      const order: SortOrder = (req.query.order as SortOrder) || "asc";

      const [products, totalProducts] = await Promise.all([
        this.productModel.getAll(page, limit, sort, order),
        this.productModel.count()
      ]);
      const totalPages = Math.ceil(totalProducts / limit);
      res.status(200).json({
        products,
        totalProducts,
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


  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { product } = req.body;

      const existingProduct = await this.productModel.getById(product.id);
      if (existingProduct) {
        throw boom.badRequest("Product already exists");
      }

      const existingCategory = await this.categoryModel.getById(product.category_id);
      if (!existingCategory) {
        throw boom.notFound("Category not found");
      }

      const existingSupplier = await this.supplierModel.getById(product.supplier_id);
      if (!existingSupplier) {
        throw boom.notFound("Supplier not found");
      }

      const createdProduct = await this.productModel.create(product);

      res.status(201).json({ product: createdProduct });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      if (!id) {
        throw boom.unauthorized("Invalid product ID");
      }
      const existingProduct = await this.productModel.getById(id);
      if (!existingProduct) {
        throw boom.notFound("Product not found");
      }
      await this.productModel.delete(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const { product } = req.body;

      const existingProduct = await this.productModel.getById(id);
      if (!existingProduct) {
        throw boom.notFound("Product not found");
      }

      //await checkIfExists(this.productModel, product.category_id, "Category")
      //await checkIfExists(this.productModel, product.supplier_id, "Supplier")

      const updatedProduct = await this.productModel.update(product);

      res.status(200).json({ product: updatedProduct });
    } catch (error) {
      next(error);
    }
  };


}
