import type { Renungan } from "../data_interfaces/RenunganInterface";
import type { RenunganInterfaceRepository } from "../interfaces/IRenunganRepositories";
import type { Prisma } from "../../../generated/prisma/client";
export declare class RenunganRepositories implements RenunganInterfaceRepository {
    createRenungan(data: Prisma.RenunganCreateInput): Promise<Renungan>;
    getRenungan(slug: string): Promise<Renungan | null>;
    getAllRenungan(): Promise<Renungan[]>;
    updateRenungan(slug: string, data: Prisma.RenunganUpdateInput): Promise<Renungan>;
    deleteRenungan(slug: string): Promise<boolean>;
    countRenungan(where?: Prisma.RenunganWhereInput): Promise<number>;
}
//# sourceMappingURL=RenunganRepository.d.ts.map