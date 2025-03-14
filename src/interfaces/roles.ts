import { Role } from "@prisma/client";

export interface RoleDocument extends Role {}
export type CreateRoleType = Pick<Role, "name" | "description">;
export type UpdateRoleType = Partial<Role>;
export interface RoleModelInterface {
  getAll(): Promise<RoleDocument[]>;
  getById(id: number): Promise<RoleDocument | null>;
  create(data: CreateRoleType): Promise<RoleDocument>;
  update(data: UpdateRoleType): Promise<RoleDocument>;
  delete(id: number): Promise<RoleDocument>;
}
