import { PrismaClient, Role_permission } from "@prisma/client";
import {
  CompoundKey,
  CreateRolepermissionType,
  RolePersmissionDocument
} from "../../interfaces";
import { findManyWithInclude } from "../../utils/modelUtils";

const prisma = new PrismaClient();

export default class RolePermissionModel {
  //importan to use many to many relationship
  static getCompoundKey(id: {
    role_id: number;
    permission_id: number;
  }): CompoundKey {
    return {
      role_id_permission_id: {
        role_id: id.role_id,
        permission_id: id.permission_id
      }
    };
  }
  static create = async (data: {
    role_id: number;
    permission_id: number;
    active: boolean;
  }): Promise<RolePersmissionDocument> =>
    await prisma.role_permission.create({
      data: data
    });

  static update = async (
    id: { role_id: number; permission_id: number },
    data: CreateRolepermissionType
  ) => {
    const compoundKey = RolePermissionModel.getCompoundKey(id);
    const result = await prisma.role_permission.upsert({
      where: compoundKey,
      update: {
        active: data.active
      },
      create: {
        role_id: data.role_id,
        permission_id: data.permission_id,
        active: data.active
      }
    });
    return result;
  };

  static getPermissionsForRole = async (role_id: number) => {
    return await findManyWithInclude(
      prisma.role_permission,
      { role_id },
      { permission: true }
    );
  };

  /**
   * Get all roles for a permission
   * @param permission_id
   * @returns
   */
  static getRolesForPermission = async (permission_id: number) => {
    return await findManyWithInclude(
      prisma.role_permission,
      { permission_id },
      { role: true }
    );
  };

  /**
   * Get all permissions
   * @returns
   */
  static getAllPermissions = async () => {
    const result = await prisma.role_permission.findMany({
      include: {
        permission: true
      }
    });
    return result;
  };

  /**
   * Get all roles
   * @returns
   */
  static getAllRoles = async () => {
    const result = await prisma.role_permission.findMany({
      include: {
        role: true
      }
    });
    return result;
  };

  static async getRolePermission(id: {
    role_id: number;
    permission_id: number;
  }): Promise<Role_permission | null> {
    const { role_id, permission_id } = id;
    const rolePermission = await prisma.role_permission.findUnique({
      where: {
        role_id_permission_id: {
          role_id: role_id,
          permission_id: permission_id
        }
      }
    });

    return rolePermission;
  }
}
