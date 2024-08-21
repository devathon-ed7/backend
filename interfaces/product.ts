import { Product } from "@prisma/client"

export interface ProductDocument extends Product {}
export type CreateProductType = Pick<
  Product,
  | "name"
  | "description"
  | "stock"
  | "price"
  | "notes"
  | "category_id"
  | "supplier_id"
  | "images"
>
export type UpdateProductType = Partial<Product>

export interface ProductModelInterface {
  getAll: () => Promise<ProductDocument[]>
  getById: (id: number) => Promise<ProductDocument | null>
  getByIdWithRelations: (id: number) => Promise<ProductDocument | null>
  getAllWithRelations: () => Promise<ProductDocument[] | null>
  create: (data: CreateProductType) => Promise<ProductDocument>
  update: (data: UpdateProductType) => Promise<ProductDocument>
  delete: (id: number) => Promise<ProductDocument>
  getByPage: ({
    skip,
    take
  }: {
    skip: number
    take: number
  }) => Promise<ProductDocument[]>
}
