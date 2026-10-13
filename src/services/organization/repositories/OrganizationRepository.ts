import type { Prisma } from "../../../generated/prisma/client";
import type {
  OrganizationCategoryType,
  OrganizationInterface,
  OrganizationQueryOptions,
  PaginatedOrganizationResult,
} from "../data_interfaces/OrganizationInterface";
import type { OrganizationInterfaceRepository } from "../interfaces/IOrganizationRepositories";
import { prisma } from "../../../config/database";
import {
  buildWhereClause,
  buildOrderBy,
  buildPaginationParams,
  buildPaginationMeta,
} from "../builders";

export class OrganizationRepositories
  implements OrganizationInterfaceRepository
{
  async createOrganization(
    data: Prisma.OrganizationCreateInput,
  ): Promise<OrganizationInterface> {
    return prisma.organization.create({ data });
  }

  async getOrganization(id: string): Promise<OrganizationInterface | null> {
    return prisma.organization.findUnique({ where: { id } });
  }

  async getAllOrganizations(
    options?: OrganizationQueryOptions | OrganizationCategoryType,
  ): Promise<PaginatedOrganizationResult> {
    const queryOptions: OrganizationQueryOptions =
      typeof options === "string" ? { category: options } : options || {};

    const { page, limit, skip, take } = buildPaginationParams(
      queryOptions.page,
      queryOptions.limit,
    );
    const where = buildWhereClause(queryOptions);
    const orderBy = buildOrderBy(queryOptions.sort);

    const [totalItems, items] = await prisma.$transaction([
      prisma.organization.count({ where }),
      prisma.organization.findMany({
        where,
        orderBy,
        skip,
        take,
      }),
    ]);

    const pagination = buildPaginationMeta(totalItems, page, limit);

    return {
      items,
      pagination,
      organization: items,
    };
  }

  async updateOrganization(
    id: string,
    data: Prisma.OrganizationUpdateInput,
  ): Promise<OrganizationInterface> {
    return prisma.organization.update({ where: { id }, data });
  }

  async deleteOrganization(id: string): Promise<boolean> {
    const deleted = await prisma.organization.delete({ where: { id } });
    return !!deleted;
  }
}

