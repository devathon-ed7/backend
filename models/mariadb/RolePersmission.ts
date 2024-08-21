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

  /**
   * Get all permissions for a role
   * @param role_id
   * @returns
   */
  static getPermissionsForRole = async (role_id: number) => {
    return await this.getRolePermissions({ role_id }, { permission: true })
  }

  /**
   * Get all roles for a permission
   * @param permission_id
   * @returns
   */
  static getRolesForPermission = async (permission_id: number) => {
    return await this.getRolePermissions({ permission_id }, { role: true })
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

  /**
   * Generic function to get roles or permissions by ID
   * @param where - Search condition (object with corresponding ID)
   * @param include - Object that defines the relationships to include
   */
  private static async getRolePermissions(
    where: Record<string, number>,
    include: Record<string, boolean>
  ) {
    const result = await prisma.rolePermission.findMany({
      where,
      include
    })
    return result
  }
}
