import { PrismaClient, Supplier } from "@prisma/client"

const prisma = new PrismaClient()

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
export default class SupplierModel {
  static getAll = async () => {
    const suppliers = await prisma.supplier.findMany()
    return suppliers
  }
  static getById = async (id: number) => {
    const supplier = await prisma.supplier.findUnique({
      where: {
        id
      }
    })
    return supplier
  }
  static getByName = async (name: string) => {
    const supplier = await prisma.supplier.findMany({
      where: {
        name: {
          contains: name
        }
      }
    })
    return supplier
  }
  static getByLocation = async (location: string) => {
    const supplier = await prisma.supplier.findMany({
      where: {
        location: {
          contains: location
        }
      }
    })
    return supplier
  }
  static getByContact = async (contact: string) => {
    const supplier = await prisma.supplier.findMany({
      where: {
        contact: {
          contains: contact
        }
      }
    })
    return supplier
  }
  static create = async (data: CreateSupplierType) => {
    const createdSupplier = await prisma.supplier.create({
      data
    })
    return createdSupplier
  }
  static update = async (data: UpdateSupplierType) => {
    const updatedSupplier = await prisma.supplier.update({
      data,
      where: {
        id: data.id
      }
    })
    return updatedSupplier
  }
  static delete = async (id: number) => {
    const deletedSupplier = await prisma.supplier.delete({
      where: {
        id
      }
    })
    return deletedSupplier
  }
}
