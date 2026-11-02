import type { JadwalInterface } from "../data_interfaces/JadwalInterface";
import type { JadwalInterfaceRepository } from "../interfaces/IJadwalRepositories";
import type { Prisma } from "../../../generated/prisma/client";
export declare class JadwalServices {
    private readonly jadwalRepository;
    constructor(jadwalRepository: JadwalInterfaceRepository);
    getAllJadwal(): Promise<JadwalInterface[]>;
    getJadwalById(id: string): Promise<JadwalInterface>;
    createJadwal(data: Prisma.JadwalCreateInput): Promise<JadwalInterface>;
    updateJadwal(id: string, data: Prisma.JadwalUpdateInput): Promise<JadwalInterface>;
    deleteJadwal(id: string): Promise<boolean>;
}
//# sourceMappingURL=JadwalServices.d.ts.map