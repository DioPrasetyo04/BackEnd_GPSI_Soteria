import type { Prisma } from "../../../generated/prisma/client";
import type {
  OrganizationCategoryType,
  OrganizationInterface,
  OrganizationQueryOptions,
  PaginatedOrganizationResult,
} from "../data_interfaces/OrganizationInterface";

export interface OrganizationInterfaceRepository {
  createOrganization(
    data: Prisma.OrganizationCreateInput,
  ): Promise<OrganizationInterface>;
  getOrganization(id: string): Promise<OrganizationInterface | null>;
  getAllOrganizations(
    options?: OrganizationQueryOptions | OrganizationCategoryType,
  ): Promise<PaginatedOrganizationResult>;
  updateOrganization(
    id: string,
    data: Prisma.OrganizationUpdateInput,
  ): Promise<OrganizationInterface>;
  deleteOrganization(id: string): Promise<boolean>;
}


export type IOrganizationRepositories = OrganizationInterfaceRepository;
