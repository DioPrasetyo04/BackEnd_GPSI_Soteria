import type { Prisma } from "../../../generated/prisma/client";
import type { OrganizationInterface } from "../data_interfaces/OrganizationInterface";
import type { OrganizationInterfaceRepository } from "../interfaces/IOrganizationRepositories";
export declare class OrganizationRepositories implements OrganizationInterfaceRepository {
    createOrganization(data: Prisma.OrganizationCreateInput): Promise<OrganizationInterface>;
    getOrganization(id: string): Promise<OrganizationInterface | null>;
    getAllOrganizations(category?: "PENGURUS_HARIAN" | "KOORDINATOR_SEKTOR"): Promise<OrganizationInterface[]>;
    updateOrganization(id: string, data: Prisma.OrganizationUpdateInput): Promise<OrganizationInterface>;
    deleteOrganization(id: string): Promise<boolean>;
    countOrganization(where?: Prisma.OrganizationWhereInput): Promise<number>;
}
//# sourceMappingURL=OrganizationRepository.d.ts.map