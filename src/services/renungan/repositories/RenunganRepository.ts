import type { Renungan } from "../data_interfaces/RenunganInterface";
import type { RenunganInterfaceRepository } from "../interfaces/IRenunganRepositories";
import type { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../../config/database";

export class RenunganRepositories implements RenunganInterfaceRepository {
  async createRenungan(data: Prisma.RenunganCreateInput): Promise<Renungan> {
    const createRenungan = await prisma.renungan.create({
      data: data,
    });

    return createRenungan;
  }
  async getRenungan(slug: string): Promise<Renungan | null> {
    const spesRenungan = await prisma.renungan.findUnique({
      where: {
        slug: slug,
      },
    });
    return spesRenungan;
  }
  async getAllRenungan(): Promise<Renungan[]> {
    const allRenungan = await prisma.renungan.findMany({
      orderBy: {
        publishedAt: "desc",
      },
    });

    return allRenungan;
  }
  async updateRenungan(
    slug: string,
    data: Prisma.RenunganUpdateInput,
  ): Promise<Renungan> {
    const updateRenungan = await prisma.renungan.update({
      where: {
        slug: slug,
      },
      data: data,
    });

    return updateRenungan;
  }
  async deleteRenungan(slug: string): Promise<boolean> {
    const deleteRenungan = await prisma.renungan.delete({
      where: {
        slug: slug,
      },
    });
    return !!deleteRenungan;
  }
}
