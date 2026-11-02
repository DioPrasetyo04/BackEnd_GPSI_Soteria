import type { Role } from "../../../types/Request";
export declare class RolePermissionRepository {
    /**
     * Mengambil semua konfigurasi permissions per role.
     * Menggabungkan data database dengan default role permissions.
     */
    getAllRolePermissions(): Promise<Record<Role, string[]>>;
    /**
     * Mengambil konfigurasi permissions untuk satu role tertentu.
     */
    getRolePermission(role: Role): Promise<string[]>;
    /**
     * Simpan atau update konfigurasi permissions untuk sebuah role.
     */
    upsertRolePermission(role: Role, permissions: string[], description?: string): Promise<{
        id: string;
        role: import("src/generated/prisma").$Enums.roleUser;
        createdAt: Date;
        updatedAt: Date;
        permissions: string[];
        description: string | null;
    }>;
    /**
     * Mengambil detail permissions seorang user (roles, customPermissions, dan perizinan efektif).
     */
    getUserPermissions(userId: string): Promise<{
        id: string;
        name: string;
        email: string;
        primaryRole: import("src/generated/prisma").$Enums.roleUser;
        roles: Role[];
        customPermissions: string[];
        effectivePermissions: string[];
    } | null>;
    /**
     * Update peran jamak (multiple roles) dan perizinan kustom seorang user.
     */
    updateUserPermissions(userId: string, data: {
        role?: Role;
        roles?: Role[];
        customPermissions?: string[];
    }): Promise<{
        name: string;
        id: string;
        email: string;
        role: import("src/generated/prisma").$Enums.roleUser;
        roles: import("src/generated/prisma").$Enums.roleUser[];
        customPermissions: string[];
    }>;
}
//# sourceMappingURL=RolePermissionRepository.d.ts.map