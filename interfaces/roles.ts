import { Roles } from "@prisma/client"

export interface RoleDocument extends Roles {}
export type CreateRoleType = Pick<Roles, "name" | "description">
export type UpdateRoleType = Partial<Roles>
export interface RoleModelInterface {
  getAll(): Promise<RoleDocument[]>
  getById(id: number): Promise<RoleDocument | null>
  create(data: CreateRoleType): Promise<RoleDocument>
  update(data: UpdateRoleType): Promise<RoleDocument>
  delete(id: number): Promise<RoleDocument>
}
