import type { Role } from "./Request";
export interface PermissionDefinition {
    id: string;
    name: string;
    description: string;
    module: string;
}
export declare const PERMISSION_MODULES: {
    module: string;
    title: string;
    permissions: {
        id: string;
        name: string;
        description: string;
        module: string;
    }[];
}[];
export declare const ALL_PERMISSIONS: PermissionDefinition[];
export declare const DEFAULT_ROLE_PERMISSIONS: Record<Role, string[]>;
/**
 * Cek apakah sekumpulan perizinan mengandung hak akses tertentu.
 * Mendukung superuser wildcard "*" atau modul wildcard "module.*".
 */
export declare function hasPermission(userPermissions: string[] | undefined, requiredPermission: string): boolean;
/**
 * Cek apakah user memiliki minimal salah satu perizinan dari daftar yang diminta.
 */
export declare function hasAnyPermission(userPermissions?: string[], requiredPermissions?: string[]): boolean;
/**
 * Cek apakah user memiliki peran yang cocok (mendukung multiple roles per user).
 */
export declare function hasRole(userRoles: Role | Role[] | undefined, allowedRoles: Role | Role[]): boolean;
/**
 * Mengkalkulasikan perizinan efektif gabungan dari semua role pengguna ditambah custom permissions pengguna.
 */
export declare function resolveEffectivePermissions(roles?: Role[], customPermissions?: string[], dynamicRoleMap?: Record<string, string[]>): string[];
//# sourceMappingURL=Permissions.d.ts.map