import { Permissions } from "@prisma/client"

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
