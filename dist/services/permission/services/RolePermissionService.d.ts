import { RolePermissionRepository } from "../repositories/RolePermissionRepository";
import type { Role } from "../../../types/Request";
export declare class RolePermissionService {
    private readonly repo;
    constructor(repo: RolePermissionRepository);
    /**
     * Mengembalikan metadata seluruh modul perizinan dan definisi perizinan yang tersedia.
     */
    getPermissionsMeta(): Promise<{
        modules: {
            module: string;
            title: string;
            permissions: {
                id: string;
                name: string;
                description: string;
                module: string;
            }[];
        }[];
        allPermissions: import("../../../types/Permissions").PermissionDefinition[];
        defaultRolePermissions: Record<Role, string[]>;
        availableRoles: {
            role: string;
            label: string;
            description: string;
        }[];
    }>;
    /**
     * Mengambil semua konfigurasi role permissions yang aktif saat ini.
     */
    getAllRolePermissions(): Promise<Record<Role, string[]>>;
    /**
     * Update perizinan untuk satu role tertentu.
     */
    updateRolePermission(role: Role, permissions: string[], description?: string): Promise<{
        id: string;
        role: import("@prisma/client").$Enums.roleUser;
        createdAt: Date;
        updatedAt: Date;
        permissions: string[];
        description: string | null;
    }>;
    /**
     * Mengambil hak akses dan perizinan user.
     */
    getUserPermissions(userId: string): Promise<{
        id: string;
        name: string;
        email: string;
        primaryRole: import("@prisma/client").$Enums.roleUser;
        roles: Role[];
        customPermissions: string[];
        effectivePermissions: string[];
    }>;
    /**
     * Update roles dan custom permissions untuk user tertentu.
     */
    updateUserPermissions(userId: string, data: {
        role?: Role;
        roles?: Role[];
        customPermissions?: string[];
    }): Promise<{
        id: string;
        name: string;
        email: string;
        primaryRole: import("@prisma/client").$Enums.roleUser;
        roles: Role[];
        customPermissions: string[];
        effectivePermissions: string[];
    } | null>;
}
//# sourceMappingURL=RolePermissionService.d.ts.map