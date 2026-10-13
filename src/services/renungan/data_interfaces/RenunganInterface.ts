export interface Renungan {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  description: string;
  image: string;
  author: string;
  category: string;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type RenunganSortOption =
  | "newest"
  | "oldest"
  | "title_asc"
  | "title_desc";

export interface RenunganListOptions {
  q?: string;
  sort?: RenunganSortOption;
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

export interface RenunganPaginatedResult {
  items: Renungan[];
  pagination: PaginationMeta;
}
