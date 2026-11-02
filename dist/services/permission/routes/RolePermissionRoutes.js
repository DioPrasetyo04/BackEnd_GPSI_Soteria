"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const VerifyToken_1 = require("../../../middlewares/VerifyToken");
const RolePermissionController_1 = require("../controllers/RolePermissionController");
const rolePermissionRoutes = express_1.default.Router();
// Semua rute roles-permissions wajib melalui autentikasi token
rolePermissionRoutes.use(VerifyToken_1.verifyToken);
/**
 * GET /api/soteria/v1/roles-permissions/meta
 * Mengambil metadata definisi modul dan daftar perizinan
 */
rolePermissionRoutes.get("/meta", (0, VerifyToken_1.verifyRoleOrPermission)({
    roles: ["SUPER_ADMIN", "ADMIN"],
    permissions: ["roles.view"],
}), RolePermissionController_1.getPermissionsMeta);
/**
 * GET /api/soteria/v1/roles-permissions/matrix
 * Mengambil seluruh perizinan yang dikonfigurasikan pada setiap role
 */
rolePermissionRoutes.get("/matrix", (0, VerifyToken_1.verifyRoleOrPermission)({
    roles: ["SUPER_ADMIN", "ADMIN"],
    permissions: ["roles.view"],
}), RolePermissionController_1.getAllRolePermissions);
/**
 * PUT /api/soteria/v1/roles-permissions/:role
 * Mengubah daftar perizinan yang dimiliki suatu role
 */
rolePermissionRoutes.put("/:role", (0, VerifyToken_1.verifyRoleOrPermission)({
    roles: ["SUPER_ADMIN", "ADMIN"],
    permissions: ["roles.manage"],
}), RolePermissionController_1.updateRolePermission);
/**
 * GET /api/soteria/v1/roles-permissions/users/:id
 * Mengambil hak akses spesifik user (multiple roles + custom permissions)
 */
rolePermissionRoutes.get("/users/:id", (0, VerifyToken_1.verifyRoleOrPermission)({
    roles: ["SUPER_ADMIN", "ADMIN"],
    permissions: ["roles.view", "users.view"],
}), RolePermissionController_1.getUserPermissions);
/**
 * PUT /api/soteria/v1/roles-permissions/users/:id
 * Memperbarui multiple roles dan perizinan kustom seorang user
 */
rolePermissionRoutes.put("/users/:id", (0, VerifyToken_1.verifyRoleOrPermission)({
    roles: ["SUPER_ADMIN", "ADMIN"],
    permissions: ["roles.manage", "users.manage"],
}), RolePermissionController_1.updateUserPermissions);
exports.default = rolePermissionRoutes;
//# sourceMappingURL=RolePermissionRoutes.js.map