import { PrismaClient } from "@prisma/client"
import { CreateSupplierType, UpdateSupplierType } from "../../interfaces"

const prisma = new PrismaClient()

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
    return await this.findSuppliers("name", name)
  }

  static getByLocation = async (location: string) => {
    return await this.findSuppliers("location", location)
  }

  static getByContact = async (contact: string) => {
    return await this.findSuppliers("contact", contact)
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

  private static async findSuppliers(field: string, value: string) {
    return await prisma.supplier.findMany({
      where: {
        [field]: {
          contains: value
        }
      }
    })
  }
}
