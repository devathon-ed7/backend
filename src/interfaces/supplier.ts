import { Supplier } from "@prisma/client"
import { SortOrder } from "./pagination"

export type CreateSupplierType = Pick<Supplier, "name" | "location" | "contact">
export type UpdateSupplierType = Partial<Supplier>

export interface SupplierModelInterface {
  getAll: (
    page: number,
    limit: number,
    sortBy: string,
    order: SortOrder
  ) => Promise<Supplier[]>
  getById: (id: string) => Promise<Supplier | null>
  getByName: (name: string) => Promise<Supplier[]>
  getByLocation: (location: string) => Promise<Supplier[]>
  getByContact: (contact: string) => Promise<Supplier[]>
  create: (data: CreateSupplierType) => Promise<Supplier>
  update: (data: UpdateSupplierType) => Promise<Supplier>
  delete: (id: string) => Promise<Supplier>
  count: () => Promise<number>
}
