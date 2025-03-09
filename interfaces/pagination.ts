export type SortOder = "asc" | "desc"

export interface UserSortOptions {
  sortBy?: string
  order?: SortOder
}

export interface PaginationOptions {
  page?: number
  limit?: number
}
