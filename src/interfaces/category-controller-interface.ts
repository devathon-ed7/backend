import { SortOrder } from "./pagination";

export interface CategoryPaginatedResponse<T> {
  categories: T[];
  totalCategories: number;
  totalPages: number;
  currentPage: number;
  sort: {
    sortBy: string;
    order: SortOrder;
  };
}
