import { Category } from "@prisma/client"
import {
  CreateCategoryType,
  UpdateCategoryType
} from "../models/mariadb/category"

export interface CategoryModelInterface {
  getById: (id: number) => Promise<Category | null>
  getAll: () => Promise<Category[]>
  create: (data: CreateCategoryType) => Promise<Category>
  delete: (id: number) => Promise<Category>
  update: (data: UpdateCategoryType) => Promise<Category>
  getByName: (name: string) => Promise<Category[]>
  getByDescription: (description: string) => Promise<Category[]>
}
