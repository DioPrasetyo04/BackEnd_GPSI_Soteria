import { prisma } from "../../../config/database";
import type { Role } from "../../../types/Request";
import {
  DEFAULT_ROLE_PERMISSIONS,
  resolveEffectivePermissions,
} from "../../../types/Permissions";
import type { roleUser } from "../../../generated/prisma/client";

export class RolePermissionRepository {
  /**
   * Mengambil semua konfigurasi permissions per role.
   * Menggabungkan data database dengan default role permissions.
   */
  async getAllRolePermissions(): Promise<Record<Role, string[]>> {
    const dbRecords = await prisma.rolePermission.findMany();
    const result: Record<string, string[]> = { ...DEFAULT_ROLE_PERMISSIONS };

    for (const record of dbRecords) {
      result[record.role as Role] = record.permissions;
    }

    return result as Record<Role, string[]>;
  }

  /**
   * Mengambil konfigurasi permissions untuk satu role tertentu.
   */
  async getRolePermission(role: Role): Promise<string[]> {
    const record = await prisma.rolePermission.findUnique({
      where: { role: role as roleUser },
    });

    if (record) {
      return record.permissions;
    }

    return DEFAULT_ROLE_PERMISSIONS[role] || [];
  }

  /**
   * Simpan atau update konfigurasi permissions untuk sebuah role.
   */
  async upsertRolePermission(
    role: Role,
    permissions: string[],
    description?: string,
  ) {
    return prisma.rolePermission.upsert({
      where: { role: role as roleUser },
      update: {
        permissions,
        description,
      },
      create: {
        role: role as roleUser,
        permissions,
        description,
      },
    });
  }

  /**
   * Mengambil detail permissions seorang user (roles, customPermissions, dan perizinan efektif).
   */
  async getUserPermissions(userId: string) {
    const user = await prisma.user.findUnique({
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

    if (!user) return null;

    const userRole = ((user as any).role || "PENGELOLA") as Role;
    const rawRoles = Array.isArray((user as any).roles)
      ? (user as any).roles
      : [];
    const userRoles = Array.from(
      new Set([userRole, ...rawRoles].filter(Boolean)),
    ) as Role[];
    const customPerms = Array.isArray(user.customPermissions)
      ? user.customPermissions
      : [];

    const dynamicMap = await this.getAllRolePermissions();
    const effectivePermissions = resolveEffectivePermissions(
      userRoles,
      customPerms,
      dynamicMap,
    );

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
  async updateUserPermissions(
    userId: string,
    data: {
      role?: Role;
      roles?: Role[];
      customPermissions?: string[];
    },
  ) {
    const updatePayload: any = {};

    if (data.roles && data.roles.length > 0) {
      updatePayload.roles = data.roles;
      updatePayload.role = data.role || data.roles[0];
    } else if (data.role) {
      updatePayload.role = data.role;
      updatePayload.roles = [data.role];
    }

    if (data.customPermissions !== undefined) {
      updatePayload.customPermissions = data.customPermissions;
    }

    const updated = await prisma.user.update({
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
