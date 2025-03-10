import { Supplier } from "@prisma/client"

export type CreateSupplierType = Pick<Supplier, "name" | "location" | "contact">
export type UpdateSupplierType = Partial<Supplier>

export interface SupplierModelInterface {
  getAll: () => Promise<Supplier[]>
  getById: (id: number) => Promise<Supplier | null>
  getByName: (name: string) => Promise<Supplier[]>
  getByLocation: (location: string) => Promise<Supplier[]>
  getByContact: (contact: string) => Promise<Supplier[]>
  create: (data: CreateSupplierType) => Promise<Supplier>
  update: (data: UpdateSupplierType) => Promise<Supplier>
  delete: (id: number) => Promise<Supplier>
}
