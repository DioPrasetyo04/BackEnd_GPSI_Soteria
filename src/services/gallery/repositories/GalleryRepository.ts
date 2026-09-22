import type { Prisma } from "../../../generated/prisma/client";
import type { GalleryInterface } from "../data_interfaces/GalleryInterface";
import type { GalleryInterfaceRepository } from "../interfaces/IGalleryRepositories";
import { prisma } from "../../../config/database";

export class GalleryRepositories implements GalleryInterfaceRepository {
  async createGallery(
    data: Prisma.GalleryCreateInput,
  ): Promise<GalleryInterface> {
    return prisma.gallery.create({ data });
  }

  async getGallery(id: string): Promise<GalleryInterface | null> {
    return prisma.gallery.findUnique({ where: { id } });
  }

  async getAllGallery(): Promise<GalleryInterface[]> {
    return prisma.gallery.findMany({
      orderBy: { date: "desc" },
    });
  }

  async updateGallery(
    id: string,
    data: Prisma.GalleryUpdateInput,
  ): Promise<GalleryInterface> {
    return prisma.gallery.update({ where: { id }, data });
  }

  async deleteGallery(id: string): Promise<boolean> {
    const deleted = await prisma.gallery.delete({ where: { id } });
    return !!deleted;
  }
}
