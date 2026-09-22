import type { Prisma } from "../../../generated/prisma/client";
import type { OrganizationInterface } from "../data_interfaces/OrganizationInterface";

export interface OrganizationInterfaceRepository {
  createOrganization(
    data: Prisma.OrganizationCreateInput,
  ): Promise<OrganizationInterface>;
  getOrganization(id: string): Promise<OrganizationInterface | null>;
  getAllOrganizations(
    category?: "PENGURUS_HARIAN" | "KOORDINATOR_SEKTOR",
  ): Promise<OrganizationInterface[]>;
  updateOrganization(
    id: string,
    data: Prisma.OrganizationUpdateInput,
  ): Promise<OrganizationInterface>;
  deleteOrganization(id: string): Promise<boolean>;
}

export type IOrganizationRepositories = OrganizationInterfaceRepository;
