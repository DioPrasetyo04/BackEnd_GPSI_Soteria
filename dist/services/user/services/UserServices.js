"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
const helpers_1 = require("../../../utils/helpers");
const invariantError_1 = __importDefault(require("../../../exceptions/invariantError"));
const notFoundError_1 = __importDefault(require("../../../exceptions/notFoundError"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const builders_1 = require("../builders");
const SALT_ROUNDS = 10;
/**
 * Buang field `password` sebelum data dikembalikan ke client.
 * Service TIDAK boleh mengirim password ke lapisan controller.
 */
const toPublic = (user) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = user;
    const userRole = (user.role || "PENGELOLA");
    const rawRoles = Array.isArray(user.roles) ? user.roles : [];
    const userRoles = Array.from(new Set([userRole, ...rawRoles].filter(Boolean)));
    const customPerms = Array.isArray(user.customPermissions)
        ? user.customPermissions
        : [];
    return {
        ...rest,
        role: userRole,
        roles: userRoles,
        customPermissions: customPerms,
    };
};
class UserServices {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    /**
     * Buat user baru.
     * - Validasi format email (custom helper)
     * - Cek keunikan email
     * - Hash password sebelum disimpan
     */
    async createUser(data) {
        // 1. Validasi format email secara manual
        if (!(0, helpers_1.isValidEmail)(data.email)) {
            throw new invariantError_1.default("Format email tidak valid");
        }
        // 2. Cek keunikan email
        const existingUser = await this.userRepository.getUserByEmail(data.email);
        if (existingUser) {
            throw new invariantError_1.default("Email sudah digunakan oleh user lain");
        }
        // 3. Hash password sebelum disimpan ke DB
        const hashedPassword = await bcryptjs_1.default.hash(String(data.password), SALT_ROUNDS);
        const userRole = data.role ||
            (Array.isArray(data.roles) && data.roles[0]) ||
            "PENGELOLA";
        const rawRoles = Array.isArray(data.roles) ? data.roles : [];
        const userRoles = Array.from(new Set([userRole, ...rawRoles].filter(Boolean)));
        const customPerms = Array.isArray(data.customPermissions)
            ? data.customPermissions
            : [];
        const newUser = await this.userRepository.createUser({
            ...data,
            password: hashedPassword,
            role: userRole,
            roles: userRoles,
            customPermissions: customPerms,
        });
        return toPublic(newUser);
    }
    /**
     * Ambil satu user berdasarkan ID.
     * Lempar NotFoundError jika tidak ditemukan.
     */
    async getUserById(id) {
        const user = await this.userRepository.getUser(id);
        if (!user) {
            throw new notFoundError_1.default(`User dengan id "${id}" tidak ditemukan`);
        }
        return toPublic(user);
    }
    /**
     * Ambil semua user dengan opsi pagination, search keyword (q), dan sorting.
     * Mengembalikan items, pagination metadata, serta alias 'users' untuk kompatibilitas.
     */
    async getAllUsers(options) {
        if (options &&
            (options.page !== undefined ||
                options.q !== undefined ||
                options.sort !== undefined ||
                options.limit !== undefined)) {
            const { items, totalItems } = await this.userRepository.getUsers(options);
            const normalizedPage = options.page && options.page > 0 ? options.page : 1;
            const normalizedLimit = options.limit && options.limit > 0 ? Math.min(options.limit, 100) : 10;
            const pagination = (0, builders_1.buildPaginationMeta)(totalItems, normalizedPage, normalizedLimit);
            const publicItems = items.map(toPublic);
            return {
                items: publicItems,
                pagination,
                users: publicItems,
            };
        }
        const users = await this.userRepository.getAllUser();
        const publicUsers = users.map(toPublic);
        const total = publicUsers.length;
        const pagination = (0, builders_1.buildPaginationMeta)(total, 1, total > 0 ? total : 10);
        return {
            items: publicUsers,
            pagination,
            users: publicUsers,
        };
    }
    /**
     * Update data user.
     * - Cek user ada dulu
     * - Validasi email baru jika diisi
     * - Hash ulang password jika diisi
     * - Sinkronisasi dua arah antara primary role dan multiple roles
     */
    async updateUser(id, data) {
        // 1. Pastikan user ada
        const existing = await this.userRepository.getUser(id);
        if (!existing) {
            throw new notFoundError_1.default(`User dengan id "${id}" tidak ditemukan`);
        }
        // 2. Validasi email jika diupdate
        if (data.email) {
            const emailStr = String(data.email);
            if (!(0, helpers_1.isValidEmail)(emailStr)) {
                throw new invariantError_1.default("Format email tidak valid");
            }
            // Cek apakah email baru sudah dipakai user lain
            const emailTaken = await this.userRepository.getUserByEmail(emailStr);
            if (emailTaken && emailTaken.id !== id) {
                throw new invariantError_1.default("Email sudah digunakan oleh user lain");
            }
        }
        // 3. Hash ulang password jika diisi
        if (data.password) {
            data.password = await bcryptjs_1.default.hash(String(data.password), SALT_ROUNDS);
        }
        // 4. Sinkronisasi role dan roles
        if (data.roles && Array.isArray(data.roles) && data.roles.length > 0) {
            if (!data.role) {
                data.role = data.roles[0];
            }
            else if (!data.roles.includes(data.role)) {
                data.roles = [data.role, ...data.roles];
            }
        }
        else if (data.role && (!data.roles || (Array.isArray(data.roles) && data.roles.length === 0))) {
            data.roles = [data.role];
        }
        const updatedUser = await this.userRepository.updateUser(id, data);
        return toPublic(updatedUser);
    }
    /**
     * Hapus user berdasarkan ID.
     * Lempar NotFoundError jika tidak ada.
     */
    async deleteUser(id) {
        const existing = await this.userRepository.getUser(id);
        if (!existing) {
            throw new notFoundError_1.default(`User dengan id "${id}" tidak ditemukan`);
        }
        return this.userRepository.deleteUser(id);
    }
}
exports.UserServices = UserServices;
//# sourceMappingURL=UserServices.js.map