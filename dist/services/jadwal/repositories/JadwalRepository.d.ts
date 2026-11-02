import type { Prisma } from "../../../generated/prisma/client";
import type { JadwalInterface } from "../data_interfaces/JadwalInterface";
import type { JadwalInterfaceRepository } from "../interfaces/IJadwalRepositories";
export declare class JadwalRepositories implements JadwalInterfaceRepository {
    createJadwal(data: Prisma.JadwalCreateInput): Promise<JadwalInterface>;
    getJadwal(id: string): Promise<JadwalInterface | null>;
    getAllJadwal(): Promise<JadwalInterface[]>;
    updateJadwal(id: string, data: Prisma.JadwalUpdateInput): Promise<JadwalInterface>;
    deleteJadwal(id: string): Promise<boolean>;
    countJadwal(where?: Prisma.JadwalWhereInput): Promise<number>;
}
//# sourceMappingURL=JadwalRepository.d.ts.map