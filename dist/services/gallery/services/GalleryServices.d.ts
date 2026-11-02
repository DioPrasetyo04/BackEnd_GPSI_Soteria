import type { GalleryInterface } from "../data_interfaces/GalleryInterface";
import type { GalleryInterfaceRepository } from "../interfaces/IGalleryRepositories";
import type { Prisma } from "../../../generated/prisma/client";
export declare class GalleryServices {
    private readonly galleryRepository;
    constructor(galleryRepository: GalleryInterfaceRepository);
    getAllGallery(): Promise<GalleryInterface[]>;
    getGalleryById(id: string): Promise<GalleryInterface>;
    createGallery(data: Prisma.GalleryCreateInput): Promise<GalleryInterface>;
    updateGallery(id: string, data: Prisma.GalleryUpdateInput): Promise<GalleryInterface>;
    deleteGallery(id: string): Promise<boolean>;
}
//# sourceMappingURL=GalleryServices.d.ts.map