import { PrismaClient } from "@prisma/client"
import { CreatePermissionType, UpdatePermissionType } from "../../interfaces"
import { findUnique } from "../../utils/modelUtils"

const prisma = new PrismaClient()

export default class PermissionModel {
  static getAll = async () => await prisma.permissions.findMany()

  static getById = async (id: number) =>
    await findUnique(prisma.permissions, { id }, {})

  static create = async (permission: CreatePermissionType) =>
    await prisma.permissions.create({
      data: permission
    })

  static update = async (permission: UpdatePermissionType) =>
    await prisma.permissions.update({
      data: permission,
      where: {
        id: permission.id
      }
    })

  static delete = async (id: number) =>
    await prisma.permissions.delete({
      where: {
        id
      }
    })
} //end class
