export interface JadwalInterface {
  id: string;
  date: Date;
  time: string;
  activity: string;
  organizer: string;
  location: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginationMetadata {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedJadwalResult {
  items: JadwalInterface[];
  pagination: PaginationMetadata;
  jadwal: JadwalInterface[];
}

export type JadwalSortOption =
  | "upcoming"
  | "latest"
  | "activity_asc"
  | "activity_desc";

export interface JadwalQueryOptions {
  q?: string;
  dateFrom?: string;
  dateTo?: string;
  sort?: JadwalSortOption;
  page?: number;
  limit?: number;
}
