import { PrismaClient } from "@prisma/client"
import { CreateSupplierType, SortOrder, UpdateSupplierType } from "../interfaces"

const prisma = new PrismaClient()

export default class SupplierModel {
  static getAll = async (
    page: number = 1,
    limit: number = 10,
    sortBy: string = "id",
    order: SortOrder = "asc"
  ) => {
    const suppliers = await prisma.supplier.findMany({

      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        [sortBy]: order
      }
    });
    return suppliers

  }

  static getById = async (id: string) => {
    return await prisma.supplier.findUnique({
      where: {
        id,
      }
    });
  }


  static getByName = async (name: string) => {
    return await prisma.supplier.findMany({
      where: {
        name
      }
    });
  }


  static getByLocation = async (location: string) => {
    return await prisma.supplier.findMany({
      where: {
        location
      }
    });
  }

  static getByContact = async (contact: string) => {
    return await prisma.supplier.findMany({
      where: {
        contact
      }
    });
  }

  static create = async (data: CreateSupplierType) => {
    return await prisma.supplier.create({
      data
    });
  }


  static update = async (data: UpdateSupplierType) => {
    return await prisma.supplier.update({
      data,
      where: { id: data.id }
    });
  }


  static delete = async (id: string) =>
    await prisma.supplier.delete({
      where: {
        id
      }
    })

  static count = async () => await prisma.supplier.count();
}
