export type SortOrder = "asc" | "desc"

export interface UserSortOptions {
  sortBy?: string
  order?: SortOrder
}

export interface PaginationOptions {
  page?: number
  limit?: number
}
