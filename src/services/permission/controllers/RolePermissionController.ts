import type { Request, Response, NextFunction } from "express";
import { RolePermissionRepository } from "../repositories/RolePermissionRepository";
import { RolePermissionService } from "../services/RolePermissionService";
import responses from "../../../utils/response";
import type { Role } from "../../../types/Request";

const repo = new RolePermissionRepository();
const service = new RolePermissionService(repo);

/**
 * GET /api/soteria/v1/roles-permissions/meta
 * Mengambil metadata definisi modul dan perizinan sistem
 */
export const getPermissionsMeta = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const meta = await service.getPermissionsMeta();
    responses(res, 200, "Berhasil mengambil metadata perizinan", meta);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/soteria/v1/roles-permissions/matrix
 * Mengambil seluruh perizinan yang dikonfigurasi per role
 */
export const getAllRolePermissions = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const rolePermissions = await service.getAllRolePermissions();
    responses(
      res,
      200,
      "Berhasil mengambil konfigurasi perizinan role",
      rolePermissions,
    );
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/soteria/v1/roles-permissions/:role
 * Menyimpan / memperbarui daftar izin untuk sebuah role
 */
export const updateRolePermission = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { role } = req.params;
    const { permissions, description } = req.body;

    const updated = await service.updateRolePermission(
      role as Role,
      permissions,
      description,
    );

    responses(
      res,
      200,
      `Perizinan untuk role '${role}' berhasil diperbarui`,
      updated,
    );
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/soteria/v1/roles-permissions/users/:id
 * Mengambil perizinan dan multiple roles seorang user
 */
export const getUserPermissions = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const data = await service.getUserPermissions(String(id));
    responses(res, 200, "Berhasil mengambil hak akses pengguna", data);
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/soteria/v1/roles-permissions/users/:id
 * Mengubah multiple roles dan perizinan kustom seorang user
 */
export const updateUserPermissions = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const currentUserId = (req as any)?.user?.id;

    if (currentUserId && currentUserId === id) {
      responses(
        res,
        400,
        "Tidak diizinkan mengubah peran atau hak akses akun sendiri demi keamanan sistem.",
        null,
      );
      return;
    }

    const { role, roles, customPermissions } = req.body;

    const data = await service.updateUserPermissions(String(id), {
      role,
      roles,
      customPermissions,
    });

    responses(res, 200, "Hak akses pengguna berhasil diperbarui", data);
  } catch (error) {
    next(error);
  }
};
