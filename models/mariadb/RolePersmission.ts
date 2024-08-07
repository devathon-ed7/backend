import { PrismaClient, RolePermission } from "@prisma/client"

export interface RolePersmissionDocument extends RolePermission {}

export type CreateRolePermissionType = Pick<
  RolePermission,
  "role_id" | "permission_id" | "active"
>
export type UpdateRolePermissionType = Partial<RolePermission>

//importan to use many to many relationship
export interface CompoundKey {
  role_id_permission_id: {
    role_id: number
    permission_id: number
  }
}

export interface RolePermissionModelInterface {
  getCompoundKey(id: { role_id: number; permission_id: number }): CompoundKey
  create(data: {
    role_id: number
    permission_id: number
    active: boolean
  }): Promise<RolePersmissionDocument>
  update(
    id: { role_id: number; permission_id: number },
    data: UpdateRolePermissionType
  ): Promise<RolePersmissionDocument>
  getPermissionsForRole(role_id: number): Promise<RolePermission[]>
  getRolesForPermission(permission_id: number): Promise<RolePermission[]>
  getAllPermissions(): Promise<RolePermission[]>
  getAllRoles(): Promise<RolePermission[]>
  getRolePermission(id: {
    role_id: number
    permission_id: number
  }): Promise<RolePermission | null>
}

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
  }): Promise<RolePersmissionDocument> => {
    const result = await prisma.rolePermission.create({
      data: data
    })
    return result
  }

  static update = async (
    id: { role_id: number; permission_id: number },
    data: UpdateRolePermissionType
  ): Promise<RolePersmissionDocument> => {
    const compoundKey = RolePermissionModel.getCompoundKey(id)
    const result = await prisma.rolePermission.update({
      where: compoundKey,
      data
    })
    return result
  }

  /**
   * Get all permissions for a role
   * @param role_Id
   * @returns
   */
  static getPermissionsForRole = async (role_id: number) => {
    const result = await prisma.rolePermission.findMany({
      where: {
        role_id
      },
      include: {
        permission: true
      }
    })
    return result
  }

  /**
   * Get all roles for a permission
   * @param permission_Id
   * @returns
   */
  static getRolesForPermission = async (permission_id: number) => {
    const result = await prisma.rolePermission.findMany({
      where: {
        permission_id
      },
      include: {
        role: true
      }
    })
    return result
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
