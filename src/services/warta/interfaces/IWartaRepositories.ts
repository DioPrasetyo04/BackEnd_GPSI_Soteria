import type { Prisma } from "../../../generated/prisma/client";
import type { WartaInterface } from "../data_interfaces/WartaInterface";

export interface WartaInterfaceRepository {
  createWarta(data: Prisma.WartaCreateInput): Promise<WartaInterface>;
  getWarta(slug: string): Promise<WartaInterface | null>;
  getWartaById(id: string): Promise<WartaInterface | null>;
  getAllWarta(): Promise<WartaInterface[]>;
  updateWarta(
    slug: string,
    data: Prisma.WartaUpdateInput,
  ): Promise<WartaInterface>;
  deleteWarta(slug: string): Promise<boolean>;
}

export type IWartaRepositories = WartaInterfaceRepository;
