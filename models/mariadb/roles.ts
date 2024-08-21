import { PrismaClient, Roles } from "@prisma/client"

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

const prisma = new PrismaClient()

export default class RoleModel {
  static getAll = async () => await prisma.roles.findMany()

  static getById = async (id: number) => {
    const role = await prisma.roles.findUnique({
      where: {
        id
      }
    })
    return role
  }

  static create = async (role: CreateRoleType) =>
    await prisma.roles.create({
      data: role
    })

  static update = async (role: UpdateRoleType) => {
    const updatedRole = await prisma.roles.update({
      data: role,
      where: {
        id: role.id
      }
    })
    return updatedRole
  }

  static delete = async (id: number) => {
    const deletedRole = await prisma.roles.delete({
      where: {
        id
      }
    })
    return deletedRole
  }
}
