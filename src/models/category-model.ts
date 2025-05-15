import { PrismaClient } from "@prisma/client";
import {
  CategoryCreateType,
  CategoryUpdateType,
  SortOrder
} from "../interfaces";

const prisma = new PrismaClient();

export default class CategoryModel {
  static count = async () => await prisma.category.count();

  static getAll = async (
    page: number = 1,
    limit: number = 10,
    sortBy: string = "id",
    order: SortOrder = "asc"
  ) =>
    await prisma.category.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        [sortBy]: order
      }
    });

  static getById = async (id: string) => {
    return await prisma.category.findUnique({
      where: {
        id
      }
    });
  };

  static create = async (data: CategoryCreateType) =>
    await prisma.category.create({ data });

  static delete = async (id: string) =>
    await prisma.category.delete({
      where: {
        id
      }
    });

  static update = async (id: string, data: CategoryUpdateType) => {
    return await prisma.category.update({
      data,
      where: { id }
    });
  };

  static getByName = async (name: string) => {
    return await prisma.category.findMany({
      where: {
        name
      }
    });
  };

  static getByDescription = async (description: string) => {
    return await prisma.category.findMany({
      where: {
        description
      }
    });
  };

  static getCategory = async () => {
    return await prisma.category.findMany({
      where: { parentCategoryId: null }, //only get root categories
      include: {
        children: true //get all children (sub categories)
      }
    });
  };
}
