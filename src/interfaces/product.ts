import { Product } from "@prisma/client";
import { SortOrder } from "./pagination";

export interface ProductDocument extends Product { }
export type CreateProductType = Pick<
  Product,
  | "name"
  | "description"
  | "stock"
  | "price"
  | "notes"
  | "supplier_id"
  | "images"
>;
export type UpdateProductType = Partial<Product>;

export interface ProductModelInterface {
  getAll: (page: number,
    limit: number,
    sortBy: string,
    order: SortOrder) => Promise<ProductDocument[]>;
  getById: (id: string) => Promise<ProductDocument | null>;
  create: (data: CreateProductType) => Promise<ProductDocument>;
  update: (data: UpdateProductType) => Promise<ProductDocument>;
  delete: (id: string) => Promise<ProductDocument>;
  getByPage: ({
    skip,
    take
  }: {
    skip: number;
    take: number;
  }) => Promise<ProductDocument[]>;
  count: () => Promise<number>;
}
