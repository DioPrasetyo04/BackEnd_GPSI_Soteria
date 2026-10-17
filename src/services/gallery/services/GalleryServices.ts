import type { GalleryInterface } from "../data_interfaces/GalleryInterface";
import type { GalleryInterfaceRepository } from "../interfaces/IGalleryRepositories";
import type { Prisma } from "../../../generated/prisma/client";
import { InvariantError, NotFoundError } from "../../../exceptions";
import { deleteUploadedFile } from "../../../utils/multer";

export class GalleryServices {
  constructor(
    private readonly galleryRepository: GalleryInterfaceRepository,
  ) {}

  async getAllGallery(): Promise<GalleryInterface[]> {
    return this.galleryRepository.getAllGallery();
  }

  async getGalleryById(id: string): Promise<GalleryInterface> {
    const gallery = await this.galleryRepository.getGallery(id);
    if (!gallery) {
      throw new NotFoundError(`Foto galeri dengan id "${id}" tidak ditemukan`);
    }
    return gallery;
  }

  async createGallery(
    data: Prisma.GalleryCreateInput,
  ): Promise<GalleryInterface> {
    if (!data.image || typeof data.image !== "string" || data.image.trim().length === 0) {
      throw new InvariantError("File gambar galeri wajib diunggah");
    }

    return this.galleryRepository.createGallery(data);
  }

  async updateGallery(
    id: string,
    data: Prisma.GalleryUpdateInput,
  ): Promise<GalleryInterface> {
    const existing = await this.getGalleryById(id);

    // Hapus foto lama jika diganti dengan foto baru
    if (data.image && typeof data.image === "string" && data.image !== existing.image) {
      deleteUploadedFile(existing.image);
    }

    return this.galleryRepository.updateGallery(id, data);
  }

  async deleteGallery(id: string): Promise<boolean> {
    const existing = await this.getGalleryById(id);

    if (existing.image) {
      deleteUploadedFile(existing.image);
    }

    return this.galleryRepository.deleteGallery(id);
  }
}
