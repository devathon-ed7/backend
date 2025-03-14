import { PrismaClient } from "@prisma/client";
import { CreateRoleType, UpdateRoleType } from "../../interfaces/roles";
import { findUnique, updateById } from "../../utils/modelUtils";

const prisma = new PrismaClient();

export default class RoleModel {
  static getAll = async () => await prisma.role.findMany();

  static getById = async (id: number) => await findUnique(prisma.role, { id });

  static create = async (role: CreateRoleType) =>
    await prisma.role.create({
      data: role
    });

  static update = async (role: UpdateRoleType) =>
    await updateById(prisma.role, role, role.id as number);

  static delete = async (id: number) =>
    await prisma.role.delete({
      where: {
        id
      }
    });
}
