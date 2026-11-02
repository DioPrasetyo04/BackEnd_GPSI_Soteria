import type { OrganizationCategoryType, OrganizationInterface } from "../data_interfaces/OrganizationInterface";
import type { OrganizationInterfaceRepository } from "../interfaces/IOrganizationRepositories";
import type { Prisma } from "../../../generated/prisma/client";
export declare class OrganizationServices {
    private readonly organizationRepository;
    constructor(organizationRepository: OrganizationInterfaceRepository);
    getAllOrganizations(category?: OrganizationCategoryType): Promise<OrganizationInterface[]>;
    getOrganizationById(id: string): Promise<OrganizationInterface>;
    createOrganization(data: Prisma.OrganizationCreateInput): Promise<OrganizationInterface>;
    updateOrganization(id: string, data: Prisma.OrganizationUpdateInput): Promise<OrganizationInterface>;
    deleteOrganization(id: string): Promise<boolean>;
}
//# sourceMappingURL=OrganizationServices.d.ts.map