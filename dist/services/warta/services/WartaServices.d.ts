import type { WartaInterface } from "../data_interfaces/WartaInterface";
import type { WartaInterfaceRepository } from "../interfaces/IWartaRepositories";
import type { Prisma } from "../../../generated/prisma/client";
export declare class WartaServices {
    private readonly wartaRepository;
    constructor(wartaRepository: WartaInterfaceRepository);
    getAllWarta(): Promise<WartaInterface[]>;
    getWarta(slug: string): Promise<WartaInterface>;
    createWarta(data: Prisma.WartaCreateInput): Promise<WartaInterface>;
    updateWarta(slug: string, data: Prisma.WartaUpdateInput): Promise<WartaInterface>;
    deleteWarta(slug: string): Promise<boolean>;
}
//# sourceMappingURL=WartaServices.d.ts.map