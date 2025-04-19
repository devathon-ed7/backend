import { Category } from "@prisma/client";
export interface CategoryModelInterface {
  count: () => Promise<number>;
  getById: (id: string) => Promise<Category | null>;
  getAll: ({
    limit,
    offset,
    sort
  }: {
    limit: number;
    offset: number;
    sort: string;
  }) => Promise<Category[]>;
  create: (data: CreateCategoryType) => Promise<Category>;
  delete: (id: string) => Promise<Category>;
  update: (data: UpdateCategoryType) => Promise<Category>;
  getByName: (name: string) => Promise<Category[]>;
  getByDescription: (description: string) => Promise<Category[]>;
}

export type CreateCategoryType = Pick<Category, "name" | "description">;
export type UpdateCategoryType = Partial<Category>;
