import { PrismaClient } from "@prisma/client";
import { SortOrder, UserCreateType, UserUpdateType } from "../interfaces";

const prisma = new PrismaClient();

export default class UserModel {
  static getAll = async (
    page: number = 1,
    limit: number = 10,
    sortBy: string = "id",
    order: SortOrder = "asc"
  ) => {
    const users = await prisma.user.findMany({
      omit: {
        password: true
      },
      include: {
        accounts: {
          include: {
            user: true
          }
        }
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        [sortBy]: order
      }
    });

    return users;
  };

  static getById = async (id: string) => {
    return await prisma.user.findUnique({
      where: {
        id
      },
      omit: {
        password: true
      },
      include: {
        accounts: {
          include: {
            user: true
          }
        }
      }
    });
  };

  static getByEmail = async (email: string) =>
    await prisma.user.findUnique({
      where: { email },
      include: {
        accounts: {
          include: {
            user: true
          }
        }
      }
    });

  static create = async (user: UserCreateType) => {
    return await prisma.user.create({
      data: user
    });
  };

  static update = async (id: string, user: UserUpdateType) => {
    return await prisma.user.update({
      data: user,
      where: { id }
    });
  };

  static delete = async (id: string) =>
    await prisma.user.delete({
      where: {
        id
      }
    });

  static count = async () => await prisma.user.count();
}
