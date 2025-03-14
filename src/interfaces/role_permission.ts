import { Role_permission } from "@prisma/client";

export interface RolePersmissionDocument extends Role_permission {}

export type CreateRolepermissionType = Pick<
  Role_permission,
  "role_id" | "permission_id" | "active"
>;
export type UpdateRolePermissionType = Partial<Role_permission>;

export interface CompoundKey {
  role_id_permission_id: {
    role_id: number;
    permission_id: number;
  };
}

export interface RolePermissionModelInterface {
  getCompoundKey(id: { role_id: number; permission_id: number }): CompoundKey;
  create(data: {
    role_id: number;
    permission_id: number;
    active: boolean;
  }): Promise<RolePersmissionDocument>;
  update(
    id: { role_id: number; permission_id: number },
    data: UpdateRolePermissionType
  ): Promise<RolePersmissionDocument>;
  getPermissionsForRole(role_id: number): Promise<Role_permission[]>;
  getRolesForPermission(permission_id: number): Promise<Role_permission[]>;
  getAllPermissions(): Promise<Role_permission[]>;
  getAllRoles(): Promise<Role_permission[]>;
  getRolePermission(id: {
    role_id: number;
    permission_id: number;
  }): Promise<Role_permission | null>;
}
