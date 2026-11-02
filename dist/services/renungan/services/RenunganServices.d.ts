import type { Renungan } from "../data_interfaces/RenunganInterface";
import type { RenunganInterfaceRepository } from "../interfaces/IRenunganRepositories";
import type { Prisma } from "../../../generated/prisma/client";
export declare class RenunganServices {
    private readonly renunganRepository;
    constructor(renunganRepository: RenunganInterfaceRepository);
    /**
     * Ambil semua data renungan, diurutkan berdasarkan publishedAt terbaru.
     */
    getAllRenungan(): Promise<Renungan[]>;
    /**
     * Ambil satu renungan berdasarkan slug.
     * Lempar NotFoundError jika data tidak ditemukan.
     */
    getRenungan(slug: string): Promise<Renungan>;
    /**
     * Buat renungan baru:
     * - Validasi judul & gambar
     * - Generate slug unik dari judul
     * - Simpan ke database
     */
    createRenungan(data: Prisma.RenunganCreateInput): Promise<Renungan>;
    /**
     * Update data renungan berdasarkan slug lama:
     * - Pastikan data ada
     * - Jika judul berubah, perbarui slug
     * - Jika gambar baru diunggah, hapus file gambar lama dari storage
     */
    updateRenungan(slug: string, data: Prisma.RenunganUpdateInput): Promise<Renungan>;
    /**
     * Hapus renungan berdasarkan slug:
     * - Pastikan data ada
     * - Hapus file gambar terkait dari storage
     * - Hapus record dari database
     */
    deleteRenungan(slug: string): Promise<boolean>;
}
//# sourceMappingURL=RenunganServices.d.ts.map