export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    currentPage: number;
    totalPages: number;
    limit: number;
  }
}

export interface PaginatedRequestParams {
  page?: number;
  limit?: number;
  search?: string;
}
