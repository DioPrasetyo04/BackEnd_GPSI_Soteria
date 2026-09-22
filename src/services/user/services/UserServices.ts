import type { UserInterfaceRepositories } from "../interfaces/IUserRepositories";
import type { Prisma } from "../../../generated/prisma/client";
import type {
  UserInterface,
  UserPublicInterface,
} from "../data_interfaces/UserInterface";
import { isValidEmail } from "../../../utils/helpers";
import InvariantError from "../../../exceptions/invariantError";
import NotFoundError from "../../../exceptions/notFoundError";
import bcrypt from "bcryptjs";
import { ClientError } from "src/exceptions";

const SALT_ROUNDS = 10;

/**
 * Buang field `password` sebelum data dikembalikan ke client.
 * Service TIDAK boleh mengirim password ke lapisan controller.
 */
const toPublic = (user: UserInterface): UserPublicInterface => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...rest } = user;
  return rest;
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

    if (!hashedPassword) {
      throw new InvariantError("Hash password gagal dilakukan");
    }

    // check role
    const roleUser = [
      "ADMIN",
      "SUPER_ADMIN",
      "PENGELOLA",
      "KOORSEK",
      "PHMJ",
      "MAJELIS",
    ];

    for (let i = 0; i < roleUser.length; i++) {
      if (data.role === roleUser[i]) {
        throw new ClientError("Role data tidak valid");
      }
    }

    const newUser = await this.userRepository.createUser({
      ...data,
      password: hashedPassword,
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
   * Ambil semua user (tanpa password).
   */
  async getAllUsers(): Promise<UserPublicInterface[]> {
    const users = await this.userRepository.getAllUser();
    return users.map(toPublic);
  }

  /**
   * Update data user.
   * - Cek user ada dulu
   * - Validasi email baru jika diisi
   * - Hash ulang password jika diisi
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

  async checkDataUser(email: string): Promise<UserInterface | null> {
    const userEmail = await this.userRepository.getUserByEmail(email);

    if (!userEmail) {
      throw new NotFoundError(`User dengan email "${email}" tidak ditemukan`);
    }

    return userEmail;
  }
}
