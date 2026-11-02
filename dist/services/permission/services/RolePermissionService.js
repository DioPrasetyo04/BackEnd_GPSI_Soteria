"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolePermissionService = void 0;
const Permissions_1 = require("../../../types/Permissions");
const invariantError_1 = __importDefault(require("../../../exceptions/invariantError"));
const notFoundError_1 = __importDefault(require("../../../exceptions/notFoundError"));
class RolePermissionService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    /**
     * Mengembalikan metadata seluruh modul perizinan dan definisi perizinan yang tersedia.
     */
    async getPermissionsMeta() {
        return {
            modules: Permissions_1.PERMISSION_MODULES,
            allPermissions: Permissions_1.ALL_PERMISSIONS,
            defaultRolePermissions: Permissions_1.DEFAULT_ROLE_PERMISSIONS,
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
    async updateRolePermission(role, permissions, description) {
        const validRoles = [
            "ADMIN",
            "SUPER_ADMIN",
            "PENGELOLA",
            "KOORSEK",
            "PHMJ",
            "MAJELIS",
        ];
        if (!validRoles.includes(role)) {
            throw new invariantError_1.default(`Peran '${role}' tidak valid`);
        }
        if (!Array.isArray(permissions)) {
            throw new invariantError_1.default("Permissions harus berupa array string");
        }
        return this.repo.upsertRolePermission(role, permissions, description);
    }
    /**
     * Mengambil hak akses dan perizinan user.
     */
    async getUserPermissions(userId) {
        const data = await this.repo.getUserPermissions(userId);
        if (!data) {
            throw new notFoundError_1.default(`User dengan ID '${userId}' tidak ditemukan`);
        }
        return data;
    }
    /**
     * Update roles dan custom permissions untuk user tertentu.
     */
    async updateUserPermissions(userId, data) {
        const user = await this.repo.getUserPermissions(userId);
        if (!user) {
            throw new notFoundError_1.default(`User dengan ID '${userId}' tidak ditemukan`);
        }
        const validRoles = [
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
                    throw new invariantError_1.default(`Peran '${r}' di dalam roles tidak valid`);
                }
            }
        }
        if (data.role && !validRoles.includes(data.role)) {
            throw new invariantError_1.default(`Peran '${data.role}' tidak valid`);
        }
        await this.repo.updateUserPermissions(userId, data);
        return this.repo.getUserPermissions(userId);
    }
}
exports.RolePermissionService = RolePermissionService;
//# sourceMappingURL=RolePermissionService.js.map