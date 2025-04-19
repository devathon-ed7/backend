import { PrismaClient } from "@prisma/client";
import { CreateProductType, SortOrder, UpdateProductType } from "../interfaces";

const prisma = new PrismaClient();
export default class ProductModel {
  static getAll = async (
    page: number = 1,
    limit: number = 10,
    sortBy: string = "id",
    order: SortOrder = "asc"
  ) => {
    const products = await prisma.product.findMany({
      include: {
        supplier: true
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        [sortBy]: order
      }
    });
    return products
  }

  static getById = async (id: string) => {
    return await prisma.product.findUnique({
      where: {
        id,
      }
    });
  }

  static delete = async (id: string) => {
    return await prisma.product.delete({
      where: {
        id
      }
    });
  }


  static create = async (data: CreateProductType) => {
    return await prisma.product.create({
      data
    });
  }

  static update = async (data: UpdateProductType) => {
    return await prisma.product.update({
      data,
      where: { id: data.id }
    });
  }

  static getByPage = async ({ skip, take }: { skip: number; take: number }) =>
    await prisma.product.findMany({ skip, take });

  static count = async () => await prisma.product.count();



}
