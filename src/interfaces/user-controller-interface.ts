

export interface UserPaginatedResponse<T> {
  users: T[];
  totalUsers: number;
  totalPages: number;
  currentPage: number;
  sort: {
    sortBy: string;
    order: 'asc' | 'desc';
  };
}