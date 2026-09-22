import type { Request, Response, NextFunction } from "express";
import { UserRepositories } from "../repositories/UserRpositories";
import { UserServices } from "../services/UserServices";
import responses from "../../../utils/response";

/**
 * Controller adalah satu-satunya layer yang boleh memanggil `responses()`.
 * Service hanya melempar error atau mengembalikan data — tidak tahu soal HTTP.
 *
 * Alur:
 *   Request → Route → Middleware (ValidateRequest) → Controller → Service → Repository → DB
 *                                                         ↑
 *                                                   responses() dipanggil di sini
 */

// Inisiasi dependency injection
const userRepo = new UserRepositories();
const userServices = new UserServices(userRepo);

/**
 * POST /api/users
 * Buat user baru
 */
export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const user = await userServices.createUser(req.body);
    responses(res, 201, "User berhasil dibuat", { user });
  } catch (error) {
    // Error (InvariantError, NotFoundError, dll) diteruskan ke ErrorsHandler middleware
    next(error);
  }
};

/**
 * GET /api/users
 * Ambil semua user
 */
export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const users = await userServices.getAllUsers();
    responses(res, 200, "Berhasil mengambil data semua user", { users });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/users/:id
 * Ambil satu user berdasarkan ID
 */
export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await userServices.getUserById(String(id));
    responses(res, 200, "User ditemukan", { user });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/users/:id
 * Update data user
 */
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await userServices.updateUser(String(id), req.body);
    responses(res, 200, "User berhasil diperbarui", { user });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/users/:id
 * Hapus user berdasarkan ID
 */
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    await userServices.deleteUser(String(id));
    responses(res, 200, "User berhasil dihapus", null);
  } catch (error) {
    next(error);
  }
};
