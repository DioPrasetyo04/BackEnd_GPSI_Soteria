import type {
  OrganizationCategoryType,
  OrganizationInterface,
  OrganizationQueryOptions,
  PaginatedOrganizationResult,
} from "../data_interfaces/OrganizationInterface";
import type { OrganizationInterfaceRepository } from "../interfaces/IOrganizationRepositories";
import type { Prisma } from "../../../generated/prisma/client";
import { NotFoundError } from "../../../exceptions";

export class OrganizationServices {
  constructor(
    private readonly organizationRepository: OrganizationInterfaceRepository,
  ) {}

  async getAllOrganizations(
    options?: OrganizationQueryOptions | OrganizationCategoryType,
  ): Promise<PaginatedOrganizationResult> {
    return this.organizationRepository.getAllOrganizations(options);
  }

  async getOrganizationById(id: string): Promise<OrganizationInterface> {
    const org = await this.organizationRepository.getOrganization(id);
    if (!org) {
      throw new NotFoundError(
        `Data organisasi dengan id "${id}" tidak ditemukan`,
      );
    }
    return org;
  }

  async createOrganization(
    data: Prisma.OrganizationCreateInput,
  ): Promise<OrganizationInterface> {
    return this.organizationRepository.createOrganization(data);
  }

  async updateOrganization(
    id: string,
    data: Prisma.OrganizationUpdateInput,
  ): Promise<OrganizationInterface> {
    await this.getOrganizationById(id);
    return this.organizationRepository.updateOrganization(id, data);
  }

  async deleteOrganization(id: string): Promise<boolean> {
    await this.getOrganizationById(id);
    return this.organizationRepository.deleteOrganization(id);
  }
}
