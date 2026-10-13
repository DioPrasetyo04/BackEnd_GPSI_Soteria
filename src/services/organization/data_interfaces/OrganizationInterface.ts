export type OrganizationCategoryType =
  | "PENGURUS_HARIAN"
  | "KOORDINATOR_SEKTOR";

export interface OrganizationInterface {
  id: string;
  category: OrganizationCategoryType;
  position: string;
  name: string | null;
  phone: string | null;
  fax: string | null;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type OrganizationSortOption =
  | "default"
  | "order_asc"
  | "order_desc"
  | "name_asc"
  | "name_desc"
  | "newest"
  | "oldest";

export interface OrganizationQueryOptions {
  q?: string;
  category?: OrganizationCategoryType;
  sort?: OrganizationSortOption;
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

export interface PaginatedOrganizationResult {
  items: OrganizationInterface[];
  pagination: PaginationMeta;
  organization: OrganizationInterface[];
}

