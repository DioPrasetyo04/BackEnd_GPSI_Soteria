export interface GalleryInterface {
  id: string;
  title: string;
  category: string;
  image: string;
  alt: string;
  date: Date;
  highlight: boolean;
  showInHome: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type GallerySortOption =
  | "newest"
  | "oldest"
  | "title_asc"
  | "title_desc";

export interface GalleryQueryOptions {
  q?: string;
  category?: string;
  sort?: GallerySortOption;
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

export interface PaginatedGalleryResult {
  items: GalleryInterface[];
  pagination: PaginationMeta;
  gallery: GalleryInterface[];
}
