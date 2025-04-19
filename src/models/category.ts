import { PrismaClient } from "@prisma/client";
import { CreateCategoryType, UpdateCategoryType } from "../interfaces";

const prisma = new PrismaClient();

export default class CategoryModel {
  static count = async () => await prisma.category.count();

  static getAll = async ({
    limit,
    offset,
    sort
  }: {
    limit: number;
    offset: number;
    sort: string;
  }) =>
    await prisma.category.findMany({
      skip: offset,
      take: limit,
      orderBy: {
        [sort]: "desc"
      }
    });

  static getById = async (id: string) => {
    return await prisma.category.findUnique({
      where: {
        id,
      }
    });
  }

  static create = async (data: CreateCategoryType) =>
    await prisma.category.create({ data });

  static delete = async (id: string) =>
    await prisma.category.delete({
      where: {
        id
      }
    });

  static update = async (data: UpdateCategoryType) => {
    return await prisma.category.update({
      data,
      where: { id: data.id }
    });
  }

  static getByName = async (name: string) => {
    return await prisma.category.findMany({
      where: {
        name
      }
    });
  }

  static getByDescription = async (description: string) => {
    return await prisma.category.findMany({
      where: {
        description
      }
    });
  }
}
