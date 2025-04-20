export type ApiResponse<T> = {
  status: boolean;
  message: string;
  data: T;
};

export type ApiError = {
  status: boolean;
  message: string;
  error?: string;
};

export type UninterceptedApiError = {
  status: boolean;
  message: string | Record<string, string[]>;
};

export interface PaginatedApiResponse<T> {
  code: number;
  status: boolean;
  data: T;
  meta: {
    page: number;
    per_page: number;
    max_page: number;
    count: number;
  };
}
