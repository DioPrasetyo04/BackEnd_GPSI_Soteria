import type { Prisma } from "../../../generated/prisma/client";
import type { WartaInterface } from "../data_interfaces/WartaInterface";
import type { WartaInterfaceRepository } from "../interfaces/IWartaRepositories";
export declare class WartaRepositories implements WartaInterfaceRepository {
    createWarta(data: Prisma.WartaCreateInput): Promise<WartaInterface>;
    getWarta(slug: string): Promise<WartaInterface | null>;
    getWartaById(id: string): Promise<WartaInterface | null>;
    getAllWarta(): Promise<WartaInterface[]>;
    updateWarta(slug: string, data: Prisma.WartaUpdateInput): Promise<WartaInterface>;
    deleteWarta(slug: string): Promise<boolean>;
    countWarta(where?: Prisma.WartaWhereInput): Promise<number>;
}
//# sourceMappingURL=WartaRepository.d.ts.map