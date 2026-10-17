import type { WartaInterface } from "../data_interfaces/WartaInterface";
import type { WartaInterfaceRepository } from "../interfaces/IWartaRepositories";
import type { Prisma } from "../../../generated/prisma/client";
import { InvariantError, NotFoundError } from "../../../exceptions";
import { generateSlug } from "../../../utils/helpers";
import { deleteUploadedFile } from "../../../utils/multer";

export class WartaServices {
  constructor(
    private readonly wartaRepository: WartaInterfaceRepository,
  ) {}

  async getAllWarta(): Promise<WartaInterface[]> {
    return this.wartaRepository.getAllWarta();
  }

  async getWarta(slug: string): Promise<WartaInterface> {
    const warta = await this.wartaRepository.getWarta(slug);
    if (!warta) {
      throw new NotFoundError(`Warta dengan slug "${slug}" tidak ditemukan`);
    }
    return warta;
  }

  async createWarta(data: Prisma.WartaCreateInput): Promise<WartaInterface> {
    if (!data.title || typeof data.title !== "string" || data.title.trim().length === 0) {
      throw new InvariantError("Judul warta wajib diisi");
    }

    if (!data.fileUrl || typeof data.fileUrl !== "string" || data.fileUrl.trim().length === 0) {
      throw new InvariantError("File dokumen warta (PDF/Doc) wajib diunggah");
    }

    let slug = generateSlug(data.title);

    const existing = await this.wartaRepository.getWarta(slug);
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const payload: Prisma.WartaCreateInput = {
      ...data,
      slug,
    };

    return this.wartaRepository.createWarta(payload);
  }

  async updateWarta(
    slug: string,
    data: Prisma.WartaUpdateInput,
  ): Promise<WartaInterface> {
    const existing = await this.getWarta(slug);

    const payload: Prisma.WartaUpdateInput = { ...data };

    if (data.title && typeof data.title === "string" && data.title.trim().length > 0) {
      let newSlug = generateSlug(data.title);

      if (newSlug !== slug) {
        const slugTaken = await this.wartaRepository.getWarta(newSlug);
        if (slugTaken && slugTaken.id !== existing.id) {
          newSlug = `${newSlug}-${Date.now().toString().slice(-4)}`;
        }
        payload.slug = newSlug;
      }
    }

    // Jika file baru diunggah, hapus file lama dari storage
    if (data.fileUrl && typeof data.fileUrl === "string" && data.fileUrl !== existing.fileUrl) {
      deleteUploadedFile(existing.fileUrl);
    }

    return this.wartaRepository.updateWarta(slug, payload);
  }

  async deleteWarta(slug: string): Promise<boolean> {
    const existing = await this.getWarta(slug);

    if (existing.fileUrl) {
      deleteUploadedFile(existing.fileUrl);
    }

    return this.wartaRepository.deleteWarta(slug);
  }
}
