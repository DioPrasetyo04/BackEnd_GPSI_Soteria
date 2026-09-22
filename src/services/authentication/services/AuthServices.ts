import type { UserInterfaceRepositories } from "../../user/interfaces/IUserRepositories";
import type { Auth } from "../data_interfaces/AuthenticationInterface";
import type { AuthInterfaceRepositories } from "../interfaces/IAuthRepositories";
import bcrypt from "bcryptjs";
import {
  AuthenticationError,
  AuthorizationError,
  InvariantError,
  ClientError,
} from "../../../exceptions";
import type { Prisma } from "../../../generated/prisma/client";
import type {
  UserInterface,
  UserPublicInterface,
} from "../../user/data_interfaces/UserInterface";
import { isValidEmail } from "../../../utils/helpers";

const toPublic = (user: UserInterface): UserPublicInterface => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...rest } = user;
  return rest;
};

export class AuthServices {
  constructor(
    private readonly authRepository: AuthInterfaceRepositories,
    private readonly userRepositories: UserInterfaceRepositories,
  ) {}

  async login(email: string, password: string): Promise<Auth> {
    const findUser = await this.userRepositories.getUserByEmail(email);
    if (!findUser) {
      throw new AuthenticationError("Email atau password salah");
    }

    const comparePassword = await bcrypt.compare(password, findUser.password);

    if (!comparePassword) {
      throw new AuthorizationError("Password salah");
    }

    const createToken = await this.authRepository.login(email);
    const now = new Date();

    // Cek apakah token kadaluwarsa (expiresAt < now)
    if (createToken.expiresAt && createToken.expiresAt < now) {
      if (createToken.token) {
        await this.authRepository.logout(createToken.token);
      }
      throw new AuthorizationError(
        "Login sudah kadaluwarsa, silahkan login ulang",
      );
    }

    return createToken;
  }

  async logout(tokenOrUserId: string): Promise<void> {
    if (!tokenOrUserId) {
      throw new AuthorizationError("Token login not found");
    }
    await this.authRepository.logout(tokenOrUserId);
  }

  async register(data: Prisma.UserCreateInput): Promise<UserPublicInterface> {
    // 1. Validasi format email
    if (!isValidEmail(data.email)) {
      throw new InvariantError("Format email tidak valid");
    }

    // 2. Cek keunikan email
    const existingUser = await this.userRepositories.getUserByEmail(data.email);
    if (existingUser) {
      throw new InvariantError("Email sudah digunakan oleh user lain");
    }

    const SALT_ROUNDS = 10;

    // 3. Hash password sebelum disimpan ke DB
    const hashedPassword = await bcrypt.hash(
      String(data.password),
      SALT_ROUNDS,
    );

    if (!hashedPassword) {
      throw new InvariantError("Hash password gagal dilakukan");
    }

    // 4. Validasi role jika dikirimkan
    const validRoles = [
      "ADMIN",
      "SUPER_ADMIN",
      "PENGELOLA",
      "KOORSEK",
      "PHMJ",
      "MAJELIS",
    ];

    if (data.role && !validRoles.includes(String(data.role))) {
      throw new ClientError("Role data tidak valid");
    }

    const newUser = await this.userRepositories.createUser({
      ...data,
      password: hashedPassword,
    });

    return toPublic(newUser);
  }
}
