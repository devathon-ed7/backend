import { PrismaClient, RolePermission } from "@prisma/client"
import {
  CompoundKey,
  CreateRolePermissionType,
  RolePersmissionDocument
} from "../../interfaces"
import { findManyWithInclude } from "../../utils/modelUtils"

const prisma = new PrismaClient()

export default class RolePermissionModel {
  //importan to use many to many relationship
  static getCompoundKey(id: {
    role_id: number
    permission_id: number
  }): CompoundKey {
    return {
      role_id_permission_id: {
        role_id: id.role_id,
        permission_id: id.permission_id
      }
    }
  }
  static create = async (data: {
    role_id: number
    permission_id: number
    active: boolean
  }): Promise<RolePersmissionDocument> =>
    await prisma.rolePermission.create({
      data: data
    })

  static update = async (
    id: { role_id: number; permission_id: number },
    data: CreateRolePermissionType //exits! is necessary to update
  ) => {
    const compoundKey = RolePermissionModel.getCompoundKey(id)
    const result = await prisma.rolePermission.upsert({
      where: compoundKey,
      update: {
        active: data.active
      },
      create: {
        role_id: data.role_id,
        permission_id: data.permission_id,
        active: data.active
      }
    })
    return result
  }

  static getPermissionsForRole = async (role_id: number) => {
    return await findManyWithInclude(
      prisma.rolePermission,
      { role_id },
      { permission: true }
    )
  }

  /**
   * Get all roles for a permission
   * @param permission_id
   * @returns
   */
  static getRolesForPermission = async (permission_id: number) => {
    return await findManyWithInclude(
      prisma.rolePermission,
      { permission_id },
      { role: true }
    )
  }

  /**
   * Get all permissions
   * @returns
   */
  static getAllPermissions = async () => {
    const result = await prisma.rolePermission.findMany({
      include: {
        permission: true
      }
    })
    return result
  }

  /**
   * Get all roles
   * @returns
   */
  static getAllRoles = async () => {
    const result = await prisma.rolePermission.findMany({
      include: {
        role: true
      }
    })
    return result
  }

  static async getRolePermission(id: {
    role_id: number
    permission_id: number
  }): Promise<RolePermission | null> {
    const { role_id, permission_id } = id
    const rolePermission = await prisma.rolePermission.findUnique({
      where: {
        role_id_permission_id: {
          role_id: role_id,
          permission_id: permission_id
        }
      }
    })

    return rolePermission
  }
}
