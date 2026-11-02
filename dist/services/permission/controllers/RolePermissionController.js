"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserPermissions = exports.getUserPermissions = exports.updateRolePermission = exports.getAllRolePermissions = exports.getPermissionsMeta = void 0;
const RolePermissionRepository_1 = require("../repositories/RolePermissionRepository");
const RolePermissionService_1 = require("../services/RolePermissionService");
const response_1 = __importDefault(require("../../../utils/response"));
const repo = new RolePermissionRepository_1.RolePermissionRepository();
const service = new RolePermissionService_1.RolePermissionService(repo);
/**
 * GET /api/soteria/v1/roles-permissions/meta
 * Mengambil metadata definisi modul dan perizinan sistem
 */
const getPermissionsMeta = async (req, res, next) => {
    try {
        const meta = await service.getPermissionsMeta();
        (0, response_1.default)(res, 200, "Berhasil mengambil metadata perizinan", meta);
    }
    catch (error) {
        next(error);
    }
};
exports.getPermissionsMeta = getPermissionsMeta;
/**
 * GET /api/soteria/v1/roles-permissions/matrix
 * Mengambil seluruh perizinan yang dikonfigurasi per role
 */
const getAllRolePermissions = async (req, res, next) => {
    try {
        const rolePermissions = await service.getAllRolePermissions();
        (0, response_1.default)(res, 200, "Berhasil mengambil konfigurasi perizinan role", rolePermissions);
    }
    catch (error) {
        next(error);
    }
};
exports.getAllRolePermissions = getAllRolePermissions;
/**
 * PUT /api/soteria/v1/roles-permissions/:role
 * Menyimpan / memperbarui daftar izin untuk sebuah role
 */
const updateRolePermission = async (req, res, next) => {
    try {
        const { role } = req.params;
        const { permissions, description } = req.body;
        const updated = await service.updateRolePermission(role, permissions, description);
        (0, response_1.default)(res, 200, `Perizinan untuk role '${role}' berhasil diperbarui`, updated);
    }
    catch (error) {
        next(error);
    }
};
exports.updateRolePermission = updateRolePermission;
/**
 * GET /api/soteria/v1/roles-permissions/users/:id
 * Mengambil perizinan dan multiple roles seorang user
 */
const getUserPermissions = async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = await service.getUserPermissions(String(id));
        (0, response_1.default)(res, 200, "Berhasil mengambil hak akses pengguna", data);
    }
    catch (error) {
        next(error);
    }
};
exports.getUserPermissions = getUserPermissions;
/**
 * PUT /api/soteria/v1/roles-permissions/users/:id
 * Mengubah multiple roles dan perizinan kustom seorang user
 */
const updateUserPermissions = async (req, res, next) => {
    try {
        const { id } = req.params;
        const currentUserId = req?.user?.id;
        if (currentUserId && currentUserId === id) {
            (0, response_1.default)(res, 400, "Tidak diizinkan mengubah peran atau hak akses akun sendiri demi keamanan sistem.", null);
            return;
        }
        const { role, roles, customPermissions } = req.body;
        const data = await service.updateUserPermissions(String(id), {
            role,
            roles,
            customPermissions,
        });
        (0, response_1.default)(res, 200, "Hak akses pengguna berhasil diperbarui", data);
    }
    catch (error) {
        next(error);
    }
};
exports.updateUserPermissions = updateUserPermissions;
//# sourceMappingURL=RolePermissionController.js.map