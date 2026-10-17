import type { Response, NextFunction } from "express";
import type { CustomRequest, Role } from "../types/Request";
import { UserRepositories } from "../services/user/repositories/UserRpositories";
import { UserServices } from "../services/user/services/UserServices";
import { AuthRepositories } from "../services/authentication/repositories/AuthRepositories";
import { RolePermissionRepository } from "../services/permission/repositories/RolePermissionRepository";
import {
  hasPermission,
  hasRole,
  resolveEffectivePermissions,
} from "../types/Permissions";
import { verifyJwtToken } from "../utils/jwt";
import responses from "../utils/response";

const userRepo = new UserRepositories();
const userServices = new UserServices(userRepo);
const authRepo = new AuthRepositories();
const rolePermissionRepo = new RolePermissionRepository();

export const verifyToken = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers?.authorization;

  if (!authHeader) {
    return responses(
      res,
      401,
      "Unauthorized",
      "Not Authorization Please Authentication",
    );
  }

  const [prefix, token] = authHeader.split(" ");

  if ((prefix === "JWT" || prefix === "Bearer") && token) {
    try {
      const decoded = verifyJwtToken(token);
      const userId = decoded.data?.id || decoded.id;

      if (!userId) {
        return responses(res, 401, "Unauthorized", null);
      }

      const [findUser, session] = await Promise.all([
        userServices.getUserById(userId).catch(() => null),
        authRepo.findByUserId(userId).catch(() => null),
      ]);

      if (!findUser) {
        return responses(res, 401, "User not found", null);
      }

      // Pastikan session aktif di database sesuai dengan token (mencegah token yang sudah logout / di-revoke)
      if (!session || session.token !== token) {
        return responses(res, 401, "Unauthorized", null);
      }

      // Pastikan session belum kadaluwarsa di database
      if (session.expiresAt && session.expiresAt <= new Date()) {
        return responses(res, 401, "Unauthorized", null);
      }

      const userRole = ((findUser as any).role || "PENGELOLA") as Role;
      const rawRoles = (findUser as any).roles;
      let userRoles: Role[] =
        Array.isArray(rawRoles) && rawRoles.length > 0
          ? (rawRoles as Role[])
          : [userRole];

      // Selalu pastikan primary userRole ada di dalam userRoles
      if (!userRoles.includes(userRole)) {
        userRoles = [userRole, ...userRoles];
      }

      const customPerms: string[] = Array.isArray(
        (findUser as any).customPermissions,
      )
        ? (findUser as any).customPermissions
        : [];

      let effectivePermissions: string[] = [];
      try {
        const dynamicMap = await rolePermissionRepo.getAllRolePermissions();
        effectivePermissions = resolveEffectivePermissions(
          userRoles,
          customPerms,
          dynamicMap,
        );
      } catch {
        effectivePermissions = resolveEffectivePermissions(
          userRoles,
          customPerms,
        );
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
    } catch {
      return responses(res, 401, "Unauthorized", null);
    }
  } else {
    return responses(res, 401, "Unauthorized", null);
  }
};

/**
 * Memverifikasi apakah user memiliki peran tunggal tertentu.
 * Mendukung multiple roles pada akun pengguna (user.roles).
 */
export const verifyRole =
  (type: Role) =>
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const userRoles = Array.from(
      new Set([
        ...(Array.isArray(req?.user?.roles) ? req.user.roles : []),
        ...(req?.user?.role ? [req.user.role] : []),
      ]),
    );

    if (userRoles.includes("SUPER_ADMIN") || userRoles.includes(type)) {
      return next();
    }

    return responses(
      res,
      403,
      "Forbidden",
      "Access denied: You do not have permission to access this resource",
    );
  };

/**
 * Helper fleksibel multi-role:
 * Memverifikasi apakah user memiliki SALAH SATU dari peran yang diizinkan.
 * Mendukung pemanggilan spread arguments `verifyRoles("ADMIN", "SUPER_ADMIN")`
 * maupun array argument `verifyRoles(["ADMIN", "SUPER_ADMIN"])`.
 * Memeriksa `user.roles` (multiple roles) dan `user.role` (primary role).
 */
export const verifyRoles =
  (...types: (Role | Role[])[]) =>
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const allowedRoles = types.flat();
    const userRoles = Array.from(
      new Set([
        ...(Array.isArray(req?.user?.roles) ? req.user.roles : []),
        ...(req?.user?.role ? [req.user.role] : []),
      ]),
    );

    // SUPER_ADMIN otomatis bypass seluruh pemeriksaan peran
    if (userRoles.includes("SUPER_ADMIN")) {
      return next();
    }

    if (hasRole(userRoles, allowedRoles)) {
      return next();
    }

    return responses(
      res,
      403,
      "Forbidden",
      "Access denied: You do not have permission to access this resource",
    );
  };

/**
 * Memverifikasi apakah user memiliki perizinan (permissions) yang dibutuhkan.
 * Mendukung pemanggilan spread arguments maupun array `verifyPermissions("users.view", "users.manage")`.
 * SUPER_ADMIN atau pemegang wildcard "*" otomatis lolos.
 */
export const verifyPermissions =
  (...permissions: (string | string[])[]) =>
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const requiredList = permissions.flat();
    const userPerms = req?.user?.permissions || [];
    const userRoles = Array.from(
      new Set([
        ...(Array.isArray(req?.user?.roles) ? req.user.roles : []),
        ...(req?.user?.role ? [req.user.role] : []),
      ]),
    );

    if (userRoles.includes("SUPER_ADMIN") || userPerms.includes("*")) {
      return next();
    }

    const isAuthorized = requiredList.some((perm) =>
      hasPermission(userPerms, perm),
    );

    if (isAuthorized) {
      return next();
    }

    return responses(
      res,
      403,
      "Forbidden",
      "Access denied: You do not have permission to access this resource",
    );
  };

export interface MultiAuthOptions {
  roles?: Role | Role[];
  permissions?: string | string[];
}

/**
 * Helper otorisasi gabungan:
 * Lolos jika user memenuhi SALAH SATU kriteria: memiliki role yang diizinkan ATAU memiliki permission yang disyaratkan.
 */
export const verifyRoleOrPermission =
  (options: MultiAuthOptions) =>
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const userRoles = Array.from(
      new Set([
        ...(Array.isArray(req?.user?.roles) ? req.user.roles : []),
        ...(req?.user?.role ? [req.user.role] : []),
      ]),
    );
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
      if (hasRole(userRoles, allowedRoles)) {
        return next();
      }
    }

    // 3. Cek Permission jika ditentukan
    if (options.permissions) {
      const requiredPerms = Array.isArray(options.permissions)
        ? options.permissions
        : [options.permissions];
      const hasPerm = requiredPerms.some((p) => hasPermission(userPerms, p));
      if (hasPerm) {
        return next();
      }
    }

    return responses(
      res,
      403,
      "Forbidden",
      "Access denied: You do not have permission to access this resource",
    );
  };
