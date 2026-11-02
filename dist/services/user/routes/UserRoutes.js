"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ValidateRequest_1 = require("../../../middlewares/ValidateRequest");
const userSchema_1 = require("../validator/userSchema");
const UserController_1 = require("../controllers/UserController");
const userRoutes = express_1.default.Router();
/**
 * User Routes
 *
 * POST   /api/users        → Buat user baru
 * GET    /api/users        → Ambil semua user
 * GET    /api/users/:id    → Ambil user berdasarkan ID
 * PUT    /api/users/:id    → Update user
 * DELETE /api/users/:id    → Hapus user
 */
userRoutes.post("/", (0, ValidateRequest_1.validateRequest)(userSchema_1.userCreateSchema), UserController_1.createUser);
userRoutes.get("/", UserController_1.getAllUsers);
userRoutes.get("/:id", UserController_1.getUserById);
userRoutes.put("/:id", (0, ValidateRequest_1.validateRequest)(userSchema_1.userUpdateSchema), UserController_1.updateUser);
userRoutes.delete("/:id", UserController_1.deleteUser);
exports.default = userRoutes;
//# sourceMappingURL=UserRoutes.js.map