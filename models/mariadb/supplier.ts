import { PrismaClient } from "@prisma/client"
import { CreateSupplierType, UpdateSupplierType } from "../../interfaces"
import { findMany, findUnique, updateById } from "../../utils/modelUtils"

const prisma = new PrismaClient()

export default class SupplierModel {
  static getAll = async () => await prisma.supplier.findMany()

  static getById = async (id: number) =>
    await findUnique(prisma.supplier, { id })

  static getByName = async (name: string) =>
    await findMany(prisma.supplier, "name", name)

  static getByLocation = async (location: string) =>
    await findMany(prisma.supplier, "location", location)

  static getByContact = async (contact: string) =>
    await findMany(prisma.supplier, "contact", contact)

  static create = async (data: CreateSupplierType) =>
    await prisma.supplier.create({
      data
    })

  static update = async (data: UpdateSupplierType) =>
    await updateById(prisma.supplier, data, data.id as number)

  static delete = async (id: number) =>
    await prisma.supplier.delete({
      where: {
        id
      }
    })
}
