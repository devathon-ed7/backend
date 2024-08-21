import { PrismaClient, Permissions } from "@prisma/client"

export interface PermissionDocument extends Permissions {}
export type CreatePermissionType = Pick<Permissions, "name">
export type UpdatePermissionType = Partial<Permissions>

export interface PermissionModelInterface {
  getAll: () => Promise<Partial<PermissionDocument>[]>
  getById: (id: number) => Promise<Partial<PermissionDocument> | null>
  create: (data: CreatePermissionType) => Promise<PermissionDocument>
  update: (data: UpdatePermissionType) => Promise<Partial<PermissionDocument>>
  delete: (id: number) => Promise<Partial<PermissionDocument>>
}

const prisma = new PrismaClient()

export default class PermissionModel {
  static getAll = async () => {
    const permissions = await prisma.permissions.findMany()
    return permissions
  }

  static getById = async (id: number) => {
    const permission = await prisma.permissions.findUnique({
      where: {
        id
      }
    })
    return permission
  }

  static create = async (permission: CreatePermissionType) =>
    await prisma.permissions.create({
      data: permission
    })

  static update = async (permission: UpdatePermissionType) => {
    const updatedPermission = await prisma.permissions.update({
      data: permission,
      where: {
        id: permission.id
      }
    })
    return updatedPermission
  }
  static delete = async (id: number) => {
    const deletedPermission = await prisma.permissions.delete({
      where: {
        id
      }
    })
    return deletedPermission
  }
} //end class
