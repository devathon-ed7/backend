import { Category } from "@prisma/client";
import { SortOrder } from "./pagination";

export interface CategoryDocument extends Category {}

export type CategoryCreateType = Pick<Category, "name" | "description">;

export type CategoryUpdateType = Partial<Category>;

export interface CategoryModelInterface {
  count: () => Promise<number>;
  getById: (id: string) => Promise<CategoryDocument | null>;
  getAll: (
    page: number,
    limit: number,
    sortBy: string,
    order: SortOrder
  ) => Promise<CategoryDocument[]>;
  getByName: (name: string) => Promise<CategoryDocument[] | null>;
  getByDescription: (description: string) => Promise<CategoryDocument[] | null>;
  create: (data: CategoryCreateType) => Promise<CategoryDocument>;
  delete: (id: string) => Promise<CategoryDocument>;
  update: (id: string, data: CategoryUpdateType) => Promise<CategoryDocument>;
  parentCount: () => Promise<number>;
  getCategory: (
    page: number,
    limit: number,
    sortBy: string,
    order: SortOrder
  ) => Promise<CategoryDocument[]>;
}
