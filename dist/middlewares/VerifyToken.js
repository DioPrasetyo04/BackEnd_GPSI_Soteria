"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRoleOrPermission = exports.verifyPermissions = exports.verifyRoles = exports.verifyRole = exports.verifyToken = void 0;
const UserRpositories_1 = require("../services/user/repositories/UserRpositories");
const UserServices_1 = require("../services/user/services/UserServices");
const AuthRepositories_1 = require("../services/authentication/repositories/AuthRepositories");
const RolePermissionRepository_1 = require("../services/permission/repositories/RolePermissionRepository");
const Permissions_1 = require("../types/Permissions");
const jwt_1 = require("../utils/jwt");
const response_1 = __importDefault(require("../utils/response"));
const userRepo = new UserRpositories_1.UserRepositories();
const userServices = new UserServices_1.UserServices(userRepo);
const authRepo = new AuthRepositories_1.AuthRepositories();
const rolePermissionRepo = new RolePermissionRepository_1.RolePermissionRepository();
const verifyToken = async (req, res, next) => {
    const authHeader = req.headers?.authorization;
    if (!authHeader) {
        return (0, response_1.default)(res, 401, "Unauthorized", "Not Authorization Please Authentication");
    }
    const [prefix, token] = authHeader.split(" ");
    if ((prefix === "JWT" || prefix === "Bearer") && token) {
        try {
            const decoded = (0, jwt_1.verifyJwtToken)(token);
            const userId = decoded.data?.id || decoded.id;
            if (!userId) {
                return (0, response_1.default)(res, 401, "Unauthorized", null);
            }
            const [findUser, session] = await Promise.all([
                userServices.getUserById(userId).catch(() => null),
                authRepo.findByUserId(userId).catch(() => null),
            ]);
            if (!findUser) {
                return (0, response_1.default)(res, 401, "User not found", null);
            }
            // Pastikan session aktif di database sesuai dengan token (mencegah token yang sudah logout / di-revoke)
            if (!session || session.token !== token) {
                return (0, response_1.default)(res, 401, "Unauthorized", null);
            }
            // Pastikan session belum kadaluwarsa di database
            if (session.expiresAt && session.expiresAt <= new Date()) {
                return (0, response_1.default)(res, 401, "Unauthorized", null);
            }
            const userRole = (findUser.role || "PENGELOLA");
            const rawRoles = findUser.roles;
            let userRoles = Array.isArray(rawRoles) && rawRoles.length > 0
                ? rawRoles
                : [userRole];
            // Selalu pastikan primary userRole ada di dalam userRoles
            if (!userRoles.includes(userRole)) {
                userRoles = [userRole, ...userRoles];
            }
            const customPerms = Array.isArray(findUser.customPermissions)
                ? findUser.customPermissions
                : [];
            let effectivePermissions = [];
            try {
                const dynamicMap = await rolePermissionRepo.getAllRolePermissions();
                effectivePermissions = (0, Permissions_1.resolveEffectivePermissions)(userRoles, customPerms, dynamicMap);
            }
            catch {
                effectivePermissions = (0, Permissions_1.resolveEffectivePermissions)(userRoles, customPerms);
            }
            req.user = {
                id: findUser.id,
                name: findUser.name,
                email: findUser.email,
                role: userRole,
                roles: userRoles,
                permissions: effectivePermissions,
            };
            return next();
        }
        catch {
            return (0, response_1.default)(res, 401, "Unauthorized", null);
        }
    }
    else {
        return (0, response_1.default)(res, 401, "Unauthorized", null);
    }
};
exports.verifyToken = verifyToken;
/**
 * Memverifikasi apakah user memiliki peran tunggal tertentu.
 * Mendukung multiple roles pada akun pengguna (user.roles).
 */
const verifyRole = (type) => async (req, res, next) => {
    const userRoles = Array.from(new Set([
        ...(Array.isArray(req?.user?.roles) ? req.user.roles : []),
        ...(req?.user?.role ? [req.user.role] : []),
    ]));
    if (userRoles.includes("SUPER_ADMIN") || userRoles.includes(type)) {
        return next();
    }
    return (0, response_1.default)(res, 403, "Forbidden", "Access denied: You do not have permission to access this resource");
};
exports.verifyRole = verifyRole;
/**
 * Helper fleksibel multi-role:
 * Memverifikasi apakah user memiliki SALAH SATU dari peran yang diizinkan.
 * Mendukung pemanggilan spread arguments `verifyRoles("ADMIN", "SUPER_ADMIN")`
 * maupun array argument `verifyRoles(["ADMIN", "SUPER_ADMIN"])`.
 * Memeriksa `user.roles` (multiple roles) dan `user.role` (primary role).
 */
const verifyRoles = (...types) => async (req, res, next) => {
    const allowedRoles = types.flat();
    const userRoles = Array.from(new Set([
        ...(Array.isArray(req?.user?.roles) ? req.user.roles : []),
        ...(req?.user?.role ? [req.user.role] : []),
    ]));
    // SUPER_ADMIN otomatis bypass seluruh pemeriksaan peran
    if (userRoles.includes("SUPER_ADMIN")) {
        return next();
    }
    if ((0, Permissions_1.hasRole)(userRoles, allowedRoles)) {
        return next();
    }
    return (0, response_1.default)(res, 403, "Forbidden", "Access denied: You do not have permission to access this resource");
};
exports.verifyRoles = verifyRoles;
/**
 * Memverifikasi apakah user memiliki perizinan (permissions) yang dibutuhkan.
 * Mendukung pemanggilan spread arguments maupun array `verifyPermissions("users.view", "users.manage")`.
 * SUPER_ADMIN atau pemegang wildcard "*" otomatis lolos.
 */
const verifyPermissions = (...permissions) => async (req, res, next) => {
    const requiredList = permissions.flat();
    const userPerms = req?.user?.permissions || [];
    const userRoles = Array.from(new Set([
        ...(Array.isArray(req?.user?.roles) ? req.user.roles : []),
        ...(req?.user?.role ? [req.user.role] : []),
    ]));
    if (userRoles.includes("SUPER_ADMIN") || userPerms.includes("*")) {
        return next();
    }
    const isAuthorized = requiredList.some((perm) => (0, Permissions_1.hasPermission)(userPerms, perm));
    if (isAuthorized) {
        return next();
    }
    return (0, response_1.default)(res, 403, "Forbidden", "Access denied: You do not have permission to access this resource");
};
exports.verifyPermissions = verifyPermissions;
/**
 * Helper otorisasi gabungan:
 * Lolos jika user memenuhi SALAH SATU kriteria: memiliki role yang diizinkan ATAU memiliki permission yang disyaratkan.
 */
const verifyRoleOrPermission = (options) => async (req, res, next) => {
    const userRoles = Array.from(new Set([
        ...(Array.isArray(req?.user?.roles) ? req.user.roles : []),
        ...(req?.user?.role ? [req.user.role] : []),
    ]));
    const userPerms = req?.user?.permissions || [];
    // 1. SUPER_ADMIN bypass
    if (userRoles.includes("SUPER_ADMIN") || userPerms.includes("*")) {
        return next();
    }
    // 2. Cek Role jika ditentukan
    if (options.roles) {
        const allowedRoles = Array.isArray(options.roles)
            ? options.roles
            : [options.roles];
        if ((0, Permissions_1.hasRole)(userRoles, allowedRoles)) {
            return next();
        }
    }
    // 3. Cek Permission jika ditentukan
    if (options.permissions) {
        const requiredPerms = Array.isArray(options.permissions)
            ? options.permissions
            : [options.permissions];
        const hasPerm = requiredPerms.some((p) => (0, Permissions_1.hasPermission)(userPerms, p));
        if (hasPerm) {
            return next();
        }
    }
    return (0, response_1.default)(res, 403, "Forbidden", "Access denied: You do not have permission to access this resource");
};
exports.verifyRoleOrPermission = verifyRoleOrPermission;
//# sourceMappingURL=VerifyToken.js.map