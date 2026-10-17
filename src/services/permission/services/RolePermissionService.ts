import { RolePermissionRepository } from "../repositories/RolePermissionRepository";
import type { Role } from "../../../types/Request";
import {
  ALL_PERMISSIONS,
  PERMISSION_MODULES,
  DEFAULT_ROLE_PERMISSIONS,
} from "../../../types/Permissions";
import InvariantError from "../../../exceptions/invariantError";
import NotFoundError from "../../../exceptions/notFoundError";

export class RolePermissionService {
  constructor(private readonly repo: RolePermissionRepository) {}

  /**
   * Mengembalikan metadata seluruh modul perizinan dan definisi perizinan yang tersedia.
   */
  async getPermissionsMeta() {
    return {
      modules: PERMISSION_MODULES,
      allPermissions: ALL_PERMISSIONS,
      defaultRolePermissions: DEFAULT_ROLE_PERMISSIONS,
      availableRoles: [
        {
          role: "SUPER_ADMIN",
          label: "Super Admin",
          description: "Akses penuh tak terbatas ke seluruh sistem",
        },
        {
          role: "ADMIN",
          label: "Administrator",
          description: "Pengelola utama sistem dan operasional gereja",
        },
        {
          role: "PHMJ",
          label: "PHMJ (Pengurus Harian)",
          description: "Pengurus Harian Majelis Jemaat",
        },
        {
          role: "MAJELIS",
          label: "Majelis Jemaat",
          description: "Pelayan majelis jemaat gereja",
        },
        {
          role: "KOORSEK",
          label: "Koordinator Sektor",
          description: "Koordinator pelayanan sektor",
        },
        {
          role: "PENGELOLA",
          label: "Pengelola Konten",
          description: "Staf multimedia & publikasi warta/renungan/jadwal",
        },
      ],
    };
  }

  /**
   * Mengambil semua konfigurasi role permissions yang aktif saat ini.
   */
  async getAllRolePermissions() {
    return this.repo.getAllRolePermissions();
  }

  /**
   * Update perizinan untuk satu role tertentu.
   */
  async updateRolePermission(
    role: Role,
    permissions: string[],
    description?: string,
  ) {
    const validRoles: Role[] = [
      "ADMIN",
      "SUPER_ADMIN",
      "PENGELOLA",
      "KOORSEK",
      "PHMJ",
      "MAJELIS",
    ];

    if (!validRoles.includes(role)) {
      throw new InvariantError(`Peran '${role}' tidak valid`);
    }

    if (!Array.isArray(permissions)) {
      throw new InvariantError("Permissions harus berupa array string");
    }

    return this.repo.upsertRolePermission(role, permissions, description);
  }

  /**
   * Mengambil hak akses dan perizinan user.
   */
  async getUserPermissions(userId: string) {
    const data = await this.repo.getUserPermissions(userId);
    if (!data) {
      throw new NotFoundError(`User dengan ID '${userId}' tidak ditemukan`);
    }
    return data;
  }

  /**
   * Update roles dan custom permissions untuk user tertentu.
   */
  async updateUserPermissions(
    userId: string,
    data: {
      role?: Role;
      roles?: Role[];
      customPermissions?: string[];
    },
  ) {
    const user = await this.repo.getUserPermissions(userId);
    if (!user) {
      throw new NotFoundError(`User dengan ID '${userId}' tidak ditemukan`);
    }

    const validRoles: Role[] = [
      "ADMIN",
      "SUPER_ADMIN",
      "PENGELOLA",
      "KOORSEK",
      "PHMJ",
      "MAJELIS",
    ];

    if (data.roles) {
      for (const r of data.roles) {
        if (!validRoles.includes(r)) {
          throw new InvariantError(`Peran '${r}' di dalam roles tidak valid`);
        }
      }
    }

    if (data.role && !validRoles.includes(data.role)) {
      throw new InvariantError(`Peran '${data.role}' tidak valid`);
    }

    await this.repo.updateUserPermissions(userId, data);
    return this.repo.getUserPermissions(userId);
  }
}
