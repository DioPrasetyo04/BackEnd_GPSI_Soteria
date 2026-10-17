import type { Renungan } from "../data_interfaces/RenunganInterface";
import type { RenunganInterfaceRepository } from "../interfaces/IRenunganRepositories";
import type { Prisma } from "../../../generated/prisma/client";
import { InvariantError, NotFoundError } from "../../../exceptions";
import { generateSlug } from "../../../utils/helpers";
import { deleteUploadedFile } from "../../../utils/multer";

export class RenunganServices {
  constructor(
    private readonly renunganRepository: RenunganInterfaceRepository,
  ) {}

  /**
   * Ambil semua data renungan, diurutkan berdasarkan publishedAt terbaru.
   */
  async getAllRenungan(): Promise<Renungan[]> {
    return await this.renunganRepository.getAllRenungan();
  }

  /**
   * Ambil satu renungan berdasarkan slug.
   * Lempar NotFoundError jika data tidak ditemukan.
   */
  async getRenungan(slug: string): Promise<Renungan> {
    const renungan = await this.renunganRepository.getRenungan(slug);

    if (!renungan) {
      throw new NotFoundError(`Renungan dengan slug "${slug}" tidak ditemukan`);
    }

    return renungan;
  }

  /**
   * Buat renungan baru:
   * - Validasi judul & gambar
   * - Generate slug unik dari judul
   * - Simpan ke database
   */
  async createRenungan(data: Prisma.RenunganCreateInput): Promise<Renungan> {
    if (!data.title || typeof data.title !== "string" || data.title.trim().length === 0) {
      throw new InvariantError("Judul renungan wajib diisi");
    }

    if (!data.image || typeof data.image !== "string" || data.image.trim().length === 0) {
      throw new InvariantError("Gambar renungan wajib diunggah");
    }

    // Generate slug otomatis dari title
    let slug = generateSlug(data.title);

    // Pastikan slug unik jika terjadi benturan
    const existing = await this.renunganRepository.getRenungan(slug);
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const payload: Prisma.RenunganCreateInput = {
      ...data,
      slug,
    };

    return this.renunganRepository.createRenungan(payload);
  }

  /**
   * Update data renungan berdasarkan slug lama:
   * - Pastikan data ada
   * - Jika judul berubah, perbarui slug
   * - Jika gambar baru diunggah, hapus file gambar lama dari storage
   */
  async updateRenungan(
    slug: string,
    data: Prisma.RenunganUpdateInput,
  ): Promise<Renungan> {
    const existing = await this.getRenungan(slug);

    const payload: Prisma.RenunganUpdateInput = { ...data };

    // Jika title diupdate dan tidak kosong, generate slug baru
    if (data.title && typeof data.title === "string" && data.title.trim().length > 0) {
      let newSlug = generateSlug(data.title);

      if (newSlug !== slug) {
        const slugTaken = await this.renunganRepository.getRenungan(newSlug);
        if (slugTaken && slugTaken.id !== existing.id) {
          newSlug = `${newSlug}-${Date.now().toString().slice(-4)}`;
        }
        payload.slug = newSlug;
      }
    }

    // Jika gambar baru diunggah, hapus gambar lama dari disk
    if (data.image && typeof data.image === "string" && data.image !== existing.image) {
      deleteUploadedFile(existing.image);
    }

    return this.renunganRepository.updateRenungan(slug, payload);
  }

  /**
   * Hapus renungan berdasarkan slug:
   * - Pastikan data ada
   * - Hapus file gambar terkait dari storage
   * - Hapus record dari database
   */
  async deleteRenungan(slug: string): Promise<boolean> {
    const existing = await this.getRenungan(slug);

    // Hapus file gambar dari server
    if (existing.image) {
      deleteUploadedFile(existing.image);
    }

    return this.renunganRepository.deleteRenungan(slug);
  }
}
