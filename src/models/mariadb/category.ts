import { PrismaClient } from "@prisma/client";
import { findMany, findUnique, updateById } from "../../utils/modelUtils";
import { CreateCategoryType, UpdateCategoryType } from "../../interfaces";

const prisma = new PrismaClient();

export default class CategoryModel {
  static count = async () => await prisma.category.count();

  static countByParam= async (field: string, value: string) => await prisma.category.count({
      where: {
        [field]: value  
      }
    });

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

  static getById = async (id: number) =>
    await findUnique(prisma.category, { id });

  static create = async (data: CreateCategoryType) =>
    await prisma.category.create({ data });

  static delete = async (id: number) =>
    await prisma.category.delete({
      where: {
        id
      }
    });

  static update = async (data: UpdateCategoryType) =>
    await updateById(prisma.category, data, data.id as number);

  static getByName = async (name: string, limit: number, offset: number, sort: string) => {
    const findMany = await prisma.category.findMany({
      skip: offset,
      take: limit,
      orderBy: {
        [sort]: "desc"
      },
      where: {
        name: {
          contains: name
        }
      }
    });
  }

  static getByDescription = async (description: string) =>
    await findMany(prisma.category, "description", description);
}
