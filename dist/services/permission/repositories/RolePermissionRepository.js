"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolePermissionRepository = void 0;
const database_1 = require("../../../config/database");
const Permissions_1 = require("../../../types/Permissions");
class RolePermissionRepository {
    /**
     * Mengambil semua konfigurasi permissions per role.
     * Menggabungkan data database dengan default role permissions.
     */
    async getAllRolePermissions() {
        const dbRecords = await database_1.prisma.rolePermission.findMany();
        const result = { ...Permissions_1.DEFAULT_ROLE_PERMISSIONS };
        for (const record of dbRecords) {
            result[record.role] = record.permissions;
        }
        return result;
    }
    /**
     * Mengambil konfigurasi permissions untuk satu role tertentu.
     */
    async getRolePermission(role) {
        const record = await database_1.prisma.rolePermission.findUnique({
            where: { role: role },
        });
        if (record) {
            return record.permissions;
        }
        return Permissions_1.DEFAULT_ROLE_PERMISSIONS[role] || [];
    }
    /**
     * Simpan atau update konfigurasi permissions untuk sebuah role.
     */
    async upsertRolePermission(role, permissions, description) {
        return database_1.prisma.rolePermission.upsert({
            where: { role: role },
            update: {
                permissions,
                description,
            },
            create: {
                role: role,
                permissions,
                description,
            },
        });
    }
    /**
     * Mengambil detail permissions seorang user (roles, customPermissions, dan perizinan efektif).
     */
    async getUserPermissions(userId) {
        const user = await database_1.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                roles: true,
                customPermissions: true,
            },
        });
        if (!user)
            return null;
        const userRole = (user.role || "PENGELOLA");
        const rawRoles = Array.isArray(user.roles)
            ? user.roles
            : [];
        const userRoles = Array.from(new Set([userRole, ...rawRoles].filter(Boolean)));
        const customPerms = Array.isArray(user.customPermissions)
            ? user.customPermissions
            : [];
        const dynamicMap = await this.getAllRolePermissions();
        const effectivePermissions = (0, Permissions_1.resolveEffectivePermissions)(userRoles, customPerms, dynamicMap);
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            primaryRole: user.role,
            roles: userRoles,
            customPermissions: customPerms,
            effectivePermissions,
        };
    }
    /**
     * Update peran jamak (multiple roles) dan perizinan kustom seorang user.
     */
    async updateUserPermissions(userId, data) {
        const updatePayload = {};
        if (data.roles && data.roles.length > 0) {
            updatePayload.roles = data.roles;
            updatePayload.role = data.role || data.roles[0];
        }
        else if (data.role) {
            updatePayload.role = data.role;
            updatePayload.roles = [data.role];
        }
        if (data.customPermissions !== undefined) {
            updatePayload.customPermissions = data.customPermissions;
        }
        const updated = await database_1.prisma.user.update({
            where: { id: userId },
            data: updatePayload,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                roles: true,
                customPermissions: true,
            },
        });
        return updated;
    }
}
exports.RolePermissionRepository = RolePermissionRepository;
//# sourceMappingURL=RolePermissionRepository.js.map