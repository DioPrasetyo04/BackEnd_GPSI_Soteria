"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUserById = exports.getAllUsers = exports.createUser = void 0;
const UserRpositories_1 = require("../repositories/UserRpositories");
const UserServices_1 = require("../services/UserServices");
const response_1 = __importDefault(require("../../../utils/response"));
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
const userRepo = new UserRpositories_1.UserRepositories();
const userServices = new UserServices_1.UserServices(userRepo);
/**
 * POST /api/users
 * Buat user baru
 */
const createUser = async (req, res, next) => {
    try {
        const user = await userServices.createUser(req.body);
        (0, response_1.default)(res, 201, "User berhasil dibuat", { user });
    }
    catch (error) {
        // Error (InvariantError, NotFoundError, dll) diteruskan ke ErrorsHandler middleware
        next(error);
    }
};
exports.createUser = createUser;
/**
 * GET /api/users
 * Ambil semua user dengan filter query (search, sort, pagination)
 */
const getAllUsers = async (req, res, next) => {
    try {
        const { q, sort, page, limit } = req.query;
        const queryOptions = {
            q: typeof q === "string" ? q : undefined,
            sort: typeof sort === "string" ? sort : undefined,
            page: page ? parseInt(String(page), 10) : undefined,
            limit: limit ? parseInt(String(limit), 10) : undefined,
        };
        const result = await userServices.getAllUsers(queryOptions);
        (0, response_1.default)(res, 200, "Berhasil mengambil data semua user", result);
    }
    catch (error) {
        next(error);
    }
};
exports.getAllUsers = getAllUsers;
/**
 * GET /api/users/:id
 * Ambil satu user berdasarkan ID
 */
const getUserById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await userServices.getUserById(String(id));
        (0, response_1.default)(res, 200, "User ditemukan", { user });
    }
    catch (error) {
        next(error);
    }
};
exports.getUserById = getUserById;
/**
 * PUT /api/users/:id
 * Update data user
 */
const updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await userServices.updateUser(String(id), req.body);
        (0, response_1.default)(res, 200, "User berhasil diperbarui", { user });
    }
    catch (error) {
        next(error);
    }
};
exports.updateUser = updateUser;
/**
 * DELETE /api/users/:id
 * Hapus user berdasarkan ID
 */
const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        await userServices.deleteUser(String(id));
        (0, response_1.default)(res, 200, "User berhasil dihapus", null);
    }
    catch (error) {
        next(error);
    }
};
exports.deleteUser = deleteUser;
//# sourceMappingURL=UserController.js.map