import type { UserInterfaceRepositories } from "../../user/interfaces/IUserRepositories";
import type { Auth } from "../data_interfaces/AuthenticationInterface";
import type { AuthInterfaceRepositories } from "../interfaces/IAuthRepositories";
import bcrypt from "bcryptjs";
import {
  AuthenticationError,
  InvariantError,
  ClientError,
} from "../../../exceptions";
import type { Prisma } from "../../../generated/prisma/client";
import type {
  UserInterface,
  UserPublicInterface,
} from "../../user/data_interfaces/UserInterface";
import { isValidEmail } from "../../../utils/helpers";
import { generateToken } from "../../../utils/jwt";
import { verifyGoogleIdToken } from "../../../utils/googleAuth";
import { verifyFacebookAccessToken } from "../../../utils/facebookAuth";
import { nanoid } from "nanoid";


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
      throw new AuthenticationError("Email atau password salah");
    }

    const { token, expiresAt } = generateToken(findUser.id);
    const authSession = await this.authRepository.saveSession(
      findUser.id,
      token,
      expiresAt,
    );

    return authSession;
  }

  async googleLogin(idToken: string): Promise<Auth> {
    const googleUser = await verifyGoogleIdToken(idToken);

    // 1. Cek apakah user sudah terdaftar di database berdasarkan email Google
    let user = await this.userRepositories.getUserByEmail(googleUser.email);

    // 2. Jika belum ada, buat user baru dengan password acak aman (autolink tanpa migrasi skema)
    if (!user) {
      const randomSecret = `G_${nanoid(32)}_${Date.now()}`;
      const randomHashedPassword = await bcrypt.hash(randomSecret, 10);

      const newUser = await this.userRepositories.createUser({
        name: googleUser.name,
        email: googleUser.email,
        password: randomHashedPassword,
        role: "PENGELOLA",
      });

      user = newUser;
    }

    // 3. Terbitkan application JWT dan simpan sesi aktif di database
    const { token, expiresAt } = generateToken(user.id);
    const authSession = await this.authRepository.saveSession(
      user.id,
      token,
      expiresAt,
    );

    return authSession;
  }

  async facebookLogin(accessToken: string): Promise<Auth> {
    const fbUser = await verifyFacebookAccessToken(accessToken);

    // 1. Cek apakah user sudah terdaftar berdasarkan email Facebook
    let user = await this.userRepositories.getUserByEmail(fbUser.email);

    // 2. Jika belum ada, buat user baru dengan password acak aman (autolink tanpa migrasi skema)
    if (!user) {
      const randomSecret = `FB_${nanoid(32)}_${Date.now()}`;
      const randomHashedPassword = await bcrypt.hash(randomSecret, 10);

      const newUser = await this.userRepositories.createUser({
        name: fbUser.name,
        email: fbUser.email,
        password: randomHashedPassword,
        role: "PENGELOLA",
      });

      user = newUser;
    }

    // 3. Terbitkan application JWT dan simpan sesi aktif di database
    const { token, expiresAt } = generateToken(user.id);
    const authSession = await this.authRepository.saveSession(
      user.id,
      token,
      expiresAt,
    );

    return authSession;
  }

  async logout(tokenOrUserId: string): Promise<void> {

    if (!tokenOrUserId) {
      throw new AuthenticationError("Token login not found");
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

    if (!data.password || data.password.length < 8) {
      throw new InvariantError(
        "Password harus diisi dan memiliki panjang minimal 8 karakter",
      );
    }

    const SALT_ROUNDS = parseInt(process.env.HASH_ROUNDS as string);

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
