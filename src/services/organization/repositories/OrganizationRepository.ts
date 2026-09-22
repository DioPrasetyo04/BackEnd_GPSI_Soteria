import type { Prisma } from "../../../generated/prisma/client";
import type { OrganizationInterface } from "../data_interfaces/OrganizationInterface";
import type { OrganizationInterfaceRepository } from "../interfaces/IOrganizationRepositories";
import { prisma } from "../../../config/database";

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
    category?: "PENGURUS_HARIAN" | "KOORDINATOR_SEKTOR",
  ): Promise<OrganizationInterface[]> {
    return prisma.organization.findMany({
      where: category ? { category } : undefined,
      orderBy: [{ category: "asc" }, { order: "asc" }],
    });
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
