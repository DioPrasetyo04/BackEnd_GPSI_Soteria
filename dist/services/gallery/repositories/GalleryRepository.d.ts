import type { Prisma } from "../../../generated/prisma/client";
import type { GalleryInterface } from "../data_interfaces/GalleryInterface";
import type { GalleryInterfaceRepository } from "../interfaces/IGalleryRepositories";
export declare class GalleryRepositories implements GalleryInterfaceRepository {
    createGallery(data: Prisma.GalleryCreateInput): Promise<GalleryInterface>;
    getGallery(id: string): Promise<GalleryInterface | null>;
    getAllGallery(): Promise<GalleryInterface[]>;
    updateGallery(id: string, data: Prisma.GalleryUpdateInput): Promise<GalleryInterface>;
    deleteGallery(id: string): Promise<boolean>;
    countGallery(where?: Prisma.GalleryWhereInput): Promise<number>;
}
//# sourceMappingURL=GalleryRepository.d.ts.map