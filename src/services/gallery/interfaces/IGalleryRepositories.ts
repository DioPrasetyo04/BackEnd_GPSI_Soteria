import type { Prisma } from "../../../generated/prisma/client";
import type { GalleryInterface } from "../data_interfaces/GalleryInterface";

export interface GalleryInterfaceRepository {
  createGallery(data: Prisma.GalleryCreateInput): Promise<GalleryInterface>;
  getGallery(id: string): Promise<GalleryInterface | null>;
  getAllGallery(): Promise<GalleryInterface[]>;
  updateGallery(
    id: string,
    data: Prisma.GalleryUpdateInput,
  ): Promise<GalleryInterface>;
  deleteGallery(id: string): Promise<boolean>;
}

export type IGalleryRepositories = GalleryInterfaceRepository;
