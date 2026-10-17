import express from "express";
import { validateRequest } from "../../../middlewares/ValidateRequest";
import { userCreateSchema, userUpdateSchema } from "../validator/userSchema";
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/UserController";

const userRoutes: express.Router = express.Router();

/**
 * User Routes
 *
 * POST   /api/users        → Buat user baru
 * GET    /api/users        → Ambil semua user
 * GET    /api/users/:id    → Ambil user berdasarkan ID
 * PUT    /api/users/:id    → Update user
 * DELETE /api/users/:id    → Hapus user
 */
userRoutes.post("/", validateRequest(userCreateSchema), createUser);
userRoutes.get("/", getAllUsers);
userRoutes.get("/:id", getUserById);
userRoutes.put("/:id", validateRequest(userUpdateSchema), updateUser);
userRoutes.delete("/:id", deleteUser);

export default userRoutes;
