import { Singleton } from "typescript-ioc";
import {
  CategoryCreateType,
  CategoryDocument,
  CategoryUpdateType,
  SortOrder
} from "../interfaces";
import CategoryModel from "../models/category-model";

@Singleton
export class CategoryService {
  public getAll = async (
    page: number,
    limit: number,
    sortBy: string,
    order: SortOrder
  ): Promise<[CategoryDocument[], number]> => {
    const categories = await CategoryModel.getCategory(
      page,
      limit,
      sortBy,
      order
    );
    const totalCategories = await CategoryModel.parentCount();
    return [categories, totalCategories];
  };

  public getById = async (value: string): Promise<CategoryDocument | null> => {
    return CategoryModel.getById(value);
  };

  public getByName = async (
    value: string
  ): Promise<CategoryDocument[] | null> => {
    return CategoryModel.getByName(value);
  };

  public getByDescription = async (
    value: string
  ): Promise<CategoryDocument[] | null> => {
    return CategoryModel.getByDescription(value);
  };

  public create = async (
    data: CategoryCreateType
  ): Promise<CategoryDocument> => {
    return CategoryModel.create(data);
  };

  public update = async (
    id: string,
    data: CategoryUpdateType
  ): Promise<CategoryDocument> => {
    return CategoryModel.update(id, data);
  };

  public delete = async (value: string): Promise<CategoryDocument> => {
    return CategoryModel.delete(value);
  };
}
