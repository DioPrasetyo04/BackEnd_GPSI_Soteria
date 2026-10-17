import express from "express";
import {
  verifyToken,
  verifyRoleOrPermission,
} from "../../../middlewares/VerifyToken";
import {
  getPermissionsMeta,
  getAllRolePermissions,
  updateRolePermission,
  getUserPermissions,
  updateUserPermissions,
} from "../controllers/RolePermissionController";

const rolePermissionRoutes: express.Router = express.Router();

// Semua rute roles-permissions wajib melalui autentikasi token
rolePermissionRoutes.use(verifyToken);

/**
 * GET /api/soteria/v1/roles-permissions/meta
 * Mengambil metadata definisi modul dan daftar perizinan
 */
rolePermissionRoutes.get(
  "/meta",
  verifyRoleOrPermission({
    roles: ["SUPER_ADMIN", "ADMIN"],
    permissions: ["roles.view"],
  }),
  getPermissionsMeta,
);

/**
 * GET /api/soteria/v1/roles-permissions/matrix
 * Mengambil seluruh perizinan yang dikonfigurasikan pada setiap role
 */
rolePermissionRoutes.get(
  "/matrix",
  verifyRoleOrPermission({
    roles: ["SUPER_ADMIN", "ADMIN"],
    permissions: ["roles.view"],
  }),
  getAllRolePermissions,
);

/**
 * PUT /api/soteria/v1/roles-permissions/:role
 * Mengubah daftar perizinan yang dimiliki suatu role
 */
rolePermissionRoutes.put(
  "/:role",
  verifyRoleOrPermission({
    roles: ["SUPER_ADMIN", "ADMIN"],
    permissions: ["roles.manage"],
  }),
  updateRolePermission,
);

/**
 * GET /api/soteria/v1/roles-permissions/users/:id
 * Mengambil hak akses spesifik user (multiple roles + custom permissions)
 */
rolePermissionRoutes.get(
  "/users/:id",
  verifyRoleOrPermission({
    roles: ["SUPER_ADMIN", "ADMIN"],
    permissions: ["roles.view", "users.view"],
  }),
  getUserPermissions,
);

/**
 * PUT /api/soteria/v1/roles-permissions/users/:id
 * Memperbarui multiple roles dan perizinan kustom seorang user
 */
rolePermissionRoutes.put(
  "/users/:id",
  verifyRoleOrPermission({
    roles: ["SUPER_ADMIN", "ADMIN"],
    permissions: ["roles.manage", "users.manage"],
  }),
  updateUserPermissions,
);

export default rolePermissionRoutes;
