import { PrismaClient } from "@prisma/client"
import { CreateRoleType, UpdateRoleType } from "../../interfaces/roles"
import { findUnique } from "../../utils/modelUtils"

const prisma = new PrismaClient()

export default class RoleModel {
  static getAll = async () => await prisma.roles.findMany()

  static getById = async (id: number) => await findUnique(prisma.roles, { id })

  static create = async (role: CreateRoleType) =>
    await prisma.roles.create({
      data: role
    })

  static update = async (role: UpdateRoleType) =>
    await prisma.roles.update({
      data: role,
      where: {
        id: role.id
      }
    })

  static delete = async (id: number) =>
    await prisma.roles.delete({
      where: {
        id
      }
    })
}
