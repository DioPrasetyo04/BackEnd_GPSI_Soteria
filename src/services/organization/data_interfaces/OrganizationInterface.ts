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
