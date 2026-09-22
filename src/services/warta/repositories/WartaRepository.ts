import type { Prisma } from "../../../generated/prisma/client";
import type { WartaInterface } from "../data_interfaces/WartaInterface";
import type { WartaInterfaceRepository } from "../interfaces/IWartaRepositories";
import { prisma } from "../../../config/database";

export class WartaRepositories implements WartaInterfaceRepository {
  async createWarta(data: Prisma.WartaCreateInput): Promise<WartaInterface> {
    return prisma.warta.create({ data });
  }

  async getWarta(slug: string): Promise<WartaInterface | null> {
    return prisma.warta.findUnique({ where: { slug } });
  }

  async getWartaById(id: string): Promise<WartaInterface | null> {
    return prisma.warta.findUnique({ where: { id } });
  }

  async getAllWarta(): Promise<WartaInterface[]> {
    return prisma.warta.findMany({
      orderBy: { publishedAt: "desc" },
    });
  }

  async updateWarta(
    slug: string,
    data: Prisma.WartaUpdateInput,
  ): Promise<WartaInterface> {
    return prisma.warta.update({ where: { slug }, data });
  }

  async deleteWarta(slug: string): Promise<boolean> {
    const deleted = await prisma.warta.delete({ where: { slug } });
    return !!deleted;
  }
}
