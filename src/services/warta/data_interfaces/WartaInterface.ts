export interface WartaInterface {
  id: string;
  title: string;
  slug: string;
  description: string;
  fileUrl: string;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type WartaSortOption =
  | "newest"
  | "oldest"
  | "title_asc"
  | "title_desc";

export interface WartaQueryOptions {
  q?: string;
  sort?: WartaSortOption;
  page?: number;
  limit?: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface WartaPaginatedResult {
  items: WartaInterface[];
  pagination: PaginationMeta;
  warta: WartaInterface[];
}
