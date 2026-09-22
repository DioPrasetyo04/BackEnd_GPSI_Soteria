import type { Prisma } from "../../../generated/prisma/client";
import type { Renungan } from "../data_interfaces/RenunganInterface";

export interface RenunganInterfaceRepository {
  createRenungan(data: Prisma.RenunganCreateInput): Promise<Renungan>;
  getRenungan(slug: string): Promise<Renungan | null>;
  getAllRenungan(): Promise<Renungan[]>;
  updateRenungan(
    slug: string,
    data: Prisma.RenunganUpdateInput,
  ): Promise<Renungan>;
  deleteRenungan(slug: string): Promise<boolean>;
}

// Alias agar kompatibel dengan penamaan 'IRenunganRepositories'
export type IRenunganRepositories = RenunganInterfaceRepository;
