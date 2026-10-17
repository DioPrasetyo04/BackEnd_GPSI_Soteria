import type { UserInterfaceRepositories } from "../interfaces/IUserRepositories";
import type { Prisma } from "../../../generated/prisma/client";
import type {
  UserInterface,
  UserPublicInterface,
  UserQueryOptions,
  PaginatedUserResult,
} from "../data_interfaces/UserInterface";
import type { Role } from "../../../types/Request";
import { isValidEmail } from "../../../utils/helpers";
import InvariantError from "../../../exceptions/invariantError";
import NotFoundError from "../../../exceptions/notFoundError";
import bcrypt from "bcryptjs";
import { buildPaginationMeta } from "../builders";

const SALT_ROUNDS = 10;

/**
 * Buang field `password` sebelum data dikembalikan ke client.
 * Service TIDAK boleh mengirim password ke lapisan controller.
 */
const toPublic = (user: UserInterface): UserPublicInterface => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...rest } = user;
  const userRole = (user.role || "PENGELOLA") as Role;
  const rawRoles = Array.isArray(user.roles) ? user.roles : [];
  const userRoles = Array.from(
    new Set([userRole, ...rawRoles].filter(Boolean)),
  ) as Role[];
  const customPerms = Array.isArray(user.customPermissions)
    ? user.customPermissions
    : [];

  return {
    ...rest,
    role: userRole as any,
    roles: userRoles as any,
    customPermissions: customPerms,
  };
};

export class UserServices {
  constructor(private readonly userRepository: UserInterfaceRepositories) {}

  /**
   * Buat user baru.
   * - Validasi format email (custom helper)
   * - Cek keunikan email
   * - Hash password sebelum disimpan
   */
  async createUser(data: Prisma.UserCreateInput): Promise<UserPublicInterface> {
    // 1. Validasi format email secara manual
    if (!isValidEmail(data.email)) {
      throw new InvariantError("Format email tidak valid");
    }

    // 2. Cek keunikan email
    const existingUser = await this.userRepository.getUserByEmail(data.email);
    if (existingUser) {
      throw new InvariantError("Email sudah digunakan oleh user lain");
    }

    // 3. Hash password sebelum disimpan ke DB
    const hashedPassword = await bcrypt.hash(
      String(data.password),
      SALT_ROUNDS,
    );

    const userRole =
      (data.role as any) ||
      (Array.isArray(data.roles) && data.roles[0]) ||
      "PENGELOLA";
    const rawRoles = Array.isArray(data.roles) ? data.roles : [];
    const userRoles = Array.from(
      new Set([userRole, ...rawRoles].filter(Boolean)),
    );
    const customPerms = Array.isArray(data.customPermissions)
      ? data.customPermissions
      : [];

    const newUser = await this.userRepository.createUser({
      ...data,
      password: hashedPassword,
      role: userRole,
      roles: userRoles as any,
      customPermissions: customPerms,
    });

    return toPublic(newUser);
  }

  /**
   * Ambil satu user berdasarkan ID.
   * Lempar NotFoundError jika tidak ditemukan.
   */
  async getUserById(id: string): Promise<UserPublicInterface> {
    const user = await this.userRepository.getUser(id);

    if (!user) {
      throw new NotFoundError(`User dengan id "${id}" tidak ditemukan`);
    }

    return toPublic(user);
  }

  /**
   * Ambil semua user dengan opsi pagination, search keyword (q), dan sorting.
   * Mengembalikan items, pagination metadata, serta alias 'users' untuk kompatibilitas.
   */
  async getAllUsers(options?: UserQueryOptions): Promise<PaginatedUserResult> {
    if (
      options &&
      (options.page !== undefined ||
        options.q !== undefined ||
        options.sort !== undefined ||
        options.limit !== undefined)
    ) {
      const { items, totalItems } = await this.userRepository.getUsers(options);
      const normalizedPage =
        options.page && options.page > 0 ? options.page : 1;
      const normalizedLimit =
        options.limit && options.limit > 0 ? Math.min(options.limit, 100) : 10;
      const pagination = buildPaginationMeta(
        totalItems,
        normalizedPage,
        normalizedLimit,
      );
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
    const pagination = buildPaginationMeta(
      total,
      1,
      total > 0 ? total : 10,
    );
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
  async updateUser(
    id: string,
    data: Prisma.UserUpdateInput,
  ): Promise<UserPublicInterface> {
    // 1. Pastikan user ada
    const existing = await this.userRepository.getUser(id);
    if (!existing) {
      throw new NotFoundError(`User dengan id "${id}" tidak ditemukan`);
    }

    // 2. Validasi email jika diupdate
    if (data.email) {
      const emailStr = String(data.email);
      if (!isValidEmail(emailStr)) {
        throw new InvariantError("Format email tidak valid");
      }

      // Cek apakah email baru sudah dipakai user lain
      const emailTaken = await this.userRepository.getUserByEmail(emailStr);
      if (emailTaken && emailTaken.id !== id) {
        throw new InvariantError("Email sudah digunakan oleh user lain");
      }
    }

    // 3. Hash ulang password jika diisi
    if (data.password) {
      data.password = await bcrypt.hash(String(data.password), SALT_ROUNDS);
    }

    // 4. Sinkronisasi role dan roles
    if (data.roles && Array.isArray(data.roles) && data.roles.length > 0) {
      if (!data.role) {
        data.role = data.roles[0];
      } else if (!data.roles.includes(data.role as any)) {
        data.roles = [data.role as any, ...data.roles];
      }
    } else if (data.role && (!data.roles || (Array.isArray(data.roles) && data.roles.length === 0))) {
      data.roles = [data.role as any];
    }

    const updatedUser = await this.userRepository.updateUser(id, data);
    return toPublic(updatedUser);
  }

  /**
   * Hapus user berdasarkan ID.
   * Lempar NotFoundError jika tidak ada.
   */
  async deleteUser(id: string): Promise<boolean> {
    const existing = await this.userRepository.getUser(id);
    if (!existing) {
      throw new NotFoundError(`User dengan id "${id}" tidak ditemukan`);
    }

    return this.userRepository.deleteUser(id);
  }
}
