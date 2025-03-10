import { RolePermission } from "@prisma/client"

export interface RolePersmissionDocument extends RolePermission {}

export type CreateRolePermissionType = Pick<
  RolePermission,
  "role_id" | "permission_id" | "active"
>
export type UpdateRolePermissionType = Partial<RolePermission>

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
