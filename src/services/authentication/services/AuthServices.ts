import type { UserInterfaceRepositories } from "../../user/interfaces/IUserRepositories";
import type { Auth } from "../data_interfaces/AuthenticationInterface";
import type { AuthInterfaceRepositories } from "../interfaces/IAuthRepositories";
import bcrypt from "bcryptjs";
import {
  AuthenticationError,
  InvariantError,
  ClientError,
} from "../../../exceptions";
import type { Prisma, roleUser } from "../../../generated/prisma/client";
import type {
  UserInterface,
  UserPublicInterface,
} from "../../user/data_interfaces/UserInterface";
import { isValidEmail } from "../../../utils/helpers";
import {
  generateAuthTokens,
  verifyRefreshToken,
  verifyJwtToken,
  decodeJwtToken,
} from "../../../utils/jwt";
import { verifyGoogleIdToken } from "../../../utils/googleAuth";
import { verifyFacebookAccessToken } from "../../../utils/facebookAuth";
import { sendAdminApprovalNotification } from "../../../utils/mailer";
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

    // Pengecekan status approval pengguna
    if (findUser.status === "PENDING") {
      const err: any = new AuthenticationError(
        "Akun Anda sedang menunggu persetujuan dan verifikasi dari Administrator.",
      );
      err.code = "ACCOUNT_PENDING";
      err.data = {
        id: findUser.id,
        name: findUser.name,
        email: findUser.email,
        role: findUser.role,
        status: findUser.status,
      };
      throw err;
    }

    if (findUser.status === "REJECTED") {
      const err: any = new AuthenticationError(
        findUser.rejectionReason
          ? `Pendaftaran akun Anda ditolak: ${findUser.rejectionReason}`
          : "Pendaftaran akun Anda ditolak oleh Administrator. Hubungi sekretariat gereja.",
      );
      err.code = "ACCOUNT_REJECTED";
      throw err;
    }

    const { token, refreshToken, expiresAt } = generateAuthTokens(findUser.id);
    const authSession = await this.authRepository.saveSession(
      findUser.id,
      token,
      expiresAt,
    );

    return {
      ...authSession,
      refreshToken,
      name: findUser.name,
      email: findUser.email,
      role: findUser.role,
      user: toPublic(findUser),
    };
  }

  async googleLogin(idToken: string): Promise<Auth> {
    const googleUser = await verifyGoogleIdToken(idToken);

    // 1. Cek apakah user sudah terdaftar di database berdasarkan email Google
    let user = await this.userRepositories.getUserByEmail(googleUser.email);

    // 2. Jika belum ada, buat user baru dengan password acak aman
    if (!user) {
      const randomSecret = `G_${nanoid(32)}_${Date.now()}`;
      const randomHashedPassword = await bcrypt.hash(randomSecret, 10);

      const newUser = await this.userRepositories.createUser({
        name: googleUser.name,
        email: googleUser.email,
        password: randomHashedPassword,
        role: "PENGELOLA",
        status: "APPROVED",
      });

      user = newUser;
    }

    // 3. Terbitkan application JWT & Refresh Token dan simpan sesi aktif di database
    const { token, refreshToken, expiresAt } = generateAuthTokens(user.id);
    const authSession = await this.authRepository.saveSession(
      user.id,
      token,
      expiresAt,
    );

    return {
      ...authSession,
      refreshToken,
      name: user.name,
      email: user.email,
      role: user.role,
      user: toPublic(user),
    };
  }

  async facebookLogin(accessToken: string): Promise<Auth> {
    const fbUser = await verifyFacebookAccessToken(accessToken);

    // 1. Cek apakah user sudah terdaftar berdasarkan email Facebook
    let user = await this.userRepositories.getUserByEmail(fbUser.email);

    // 2. Jika belum ada, buat user baru dengan password acak aman
    if (!user) {
      const randomSecret = `FB_${nanoid(32)}_${Date.now()}`;
      const randomHashedPassword = await bcrypt.hash(randomSecret, 10);

      const newUser = await this.userRepositories.createUser({
        name: fbUser.name,
        email: fbUser.email,
        password: randomHashedPassword,
        role: "PENGELOLA",
        status: "APPROVED",
      });

      user = newUser;
    }

    // 3. Terbitkan application JWT & Refresh Token dan simpan sesi aktif di database
    const { token, refreshToken, expiresAt } = generateAuthTokens(user.id);
    const authSession = await this.authRepository.saveSession(
      user.id,
      token,
      expiresAt,
    );

    return {
      ...authSession,
      refreshToken,
      name: user.name,
      email: user.email,
      role: user.role,
      user: toPublic(user),
    };
  }

  async refreshToken(tokenInput: string): Promise<Auth> {
    if (
      !tokenInput ||
      typeof tokenInput !== "string" ||
      tokenInput.trim().length === 0
    ) {
      throw new AuthenticationError("Token atau refresh token wajib disertakan");
    }

    const cleanToken = tokenInput.trim();
    let userId: string | undefined;

    // 1. Coba verifikasi apakah token ini merupakan dedicated Refresh Token
    try {
      const decodedRefresh = verifyRefreshToken(cleanToken);
      userId = decodedRefresh.id || decodedRefresh.data?.id;
    } catch {
      // 2. Jika bukan refresh token, coba decode sebagai access token
      try {
        const decodedAccess = verifyJwtToken(cleanToken);
        userId = decodedAccess.id || decodedAccess.data?.id;
      } catch {
        const decodedFallback = decodeJwtToken(cleanToken);
        if (
          decodedFallback &&
          (decodedFallback.id || decodedFallback.data?.id)
        ) {
          userId = decodedFallback.id || decodedFallback.data?.id;
        }
      }
    }

    if (!userId) {
      throw new AuthenticationError(
        "Token atau refresh token tidak valid atau telah kedaluwarsa",
      );
    }

    // 3. Pastikan pengguna masih terdaftar di sistem
    const user = await this.userRepositories.getUser(userId);
    if (!user) {
      throw new AuthenticationError("Pengguna tidak ditemukan");
    }

    // 4. Pastikan sesi login aktif pengguna di database masih ada (belum logout)
    const activeSession = await this.authRepository.findByUserId(userId);
    if (!activeSession) {
      throw new AuthenticationError(
        "Sesi login tidak ditemukan atau Anda telah logout, silakan login kembali",
      );
    }

    // 5. Terbitkan pasangan token baru (Token Rotation)
    const {
      token: newAccessToken,
      refreshToken: newRefreshToken,
      expiresAt: newExpiresAt,
    } = generateAuthTokens(userId);

    // 6. Simpan sesi aktif baru ke database
    const updatedSession = await this.authRepository.saveSession(
      userId,
      newAccessToken,
      newExpiresAt,
    );

    return {
      ...updatedSession,
      refreshToken: newRefreshToken,
      name: user.name,
      email: user.email,
      role: user.role,
      user: toPublic(user),
    };
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

    const SALT_ROUNDS = parseInt(process.env.HASH_ROUNDS as string) || 10;

    // 3. Hash password sebelum disimpan ke DB
    const hashedPassword = await bcrypt.hash(
      String(data.password),
      SALT_ROUNDS,
    );

    if (!hashedPassword) {
      throw new InvariantError("Hash password gagal dilakukan");
    }

    // 4. Validasi role jika dikirimkan
    const validRoles: roleUser[] = [
      "ADMIN",
      "SUPER_ADMIN",
      "PENGELOLA",
      "KOORSEK",
      "PHMJ",
      "MAJELIS",
    ];

    const assignedRole =
      data.role && validRoles.includes(data.role as roleUser)
        ? (data.role as roleUser)
        : "PENGELOLA";

    const approvalToken = `apr_${nanoid(32)}`;
    const now = new Date();

    const newUser = await this.userRepositories.createUser({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: assignedRole,
      status: "PENDING",
      approvalToken,
      lastNotificationSentAt: now,
    });

    // Kirimkan notifikasi email ke Admin/Pengelola yang sudah aktif
    this.userRepositories
      .getAllUser()
      .then((users) => {
        const adminEmails = users
          .filter(
            (u) =>
              (u.role === "ADMIN" ||
                u.role === "SUPER_ADMIN" ||
                u.role === "PENGELOLA") &&
              u.status === "APPROVED",
          )
          .map((u) => u.email);

        sendAdminApprovalNotification({
          adminEmails,
          applicant: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            createdAt: newUser.createdAt,
          },
          approvalToken,
        });
      })
      .catch((err) => {
        console.error("Gagal mengirim email notifikasi ke admin:", err);
      });

    return toPublic(newUser);
  }

  async resendApproval(
    email: string,
  ): Promise<{ message: string; nextAllowedSeconds: number }> {
    if (!email || !isValidEmail(email)) {
      throw new InvariantError("Format email tidak valid");
    }

    const user = await this.userRepositories.getUserByEmail(email);
    if (!user) {
      throw new InvariantError("Pengguna dengan email tersebut tidak ditemukan");
    }

    if (user.status === "APPROVED") {
      throw new InvariantError("Akun ini sudah disetujui, silakan login ke portal");
    }

    if (user.status === "REJECTED") {
      throw new InvariantError(
        "Pendaftaran akun ini telah ditolak oleh Administrator.",
      );
    }

    // Rate Limiting Check (Minimal jeda 60 detik)
    const now = new Date();
    const COOLDOWN_SECONDS = 60;
    if (user.lastNotificationSentAt) {
      const elapsed = Math.floor(
        (now.getTime() - new Date(user.lastNotificationSentAt).getTime()) /
          1000,
      );
      if (elapsed < COOLDOWN_SECONDS) {
        const remaining = COOLDOWN_SECONDS - elapsed;
        const err: any = new ClientError(
          `Harap tunggu ${remaining} detik sebelum mengirim ulang notifikasi.`,
          429,
        );
        err.data = { remainingSeconds: remaining };
        throw err;
      }
    }

    let token = user.approvalToken;
    if (!token) {
      token = `apr_${nanoid(32)}`;
    }

    await this.userRepositories.updateUser(user.id, {
      approvalToken: token,
      lastNotificationSentAt: now,
    });

    const allUsers = await this.userRepositories.getAllUser();
    const adminEmails = allUsers
      .filter(
        (u) =>
          (u.role === "ADMIN" ||
            u.role === "SUPER_ADMIN" ||
            u.role === "PENGELOLA") &&
          u.status === "APPROVED",
      )
      .map((u) => u.email);

    sendAdminApprovalNotification({
      adminEmails,
      applicant: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
      approvalToken: token,
    }).catch((err) => console.error("Resend approval email error:", err));

    return {
      message:
        "Notifikasi verifikasi berhasil dikirimkan ulang ke Administrator",
      nextAllowedSeconds: COOLDOWN_SECONDS,
    };
  }

  async getApprovalInfo(token: string): Promise<UserPublicInterface> {
    if (!token) {
      throw new InvariantError("Token verifikasi wajib disertakan");
    }

    const user = await this.userRepositories.getUserByApprovalToken(token);
    if (!user) {
      throw new InvariantError(
        "Tautan verifikasi tidak valid atau telah kedaluwarsa.",
      );
    }

    return toPublic(user);
  }

  async processApproval(
    token: string,
    action: "approve" | "reject",
    reason?: string,
  ): Promise<{ status: string; message: string; user: UserPublicInterface }> {
    if (!token) {
      throw new InvariantError("Token verifikasi wajib disertakan");
    }

    const user = await this.userRepositories.getUserByApprovalToken(token);
    if (!user) {
      throw new InvariantError(
        "Tautan verifikasi tidak valid atau telah kedaluwarsa.",
      );
    }

    if (action === "approve") {
      const updated = await this.userRepositories.updateUser(user.id, {
        status: "APPROVED",
        approvalToken: null,
        rejectionReason: null,
      });

      return {
        status: "APPROVED",
        message: `Akun ${user.name} berhasil disetujui dan diaktifkan sebagai ${user.role}.`,
        user: toPublic(updated),
      };
    } else {
      const updated = await this.userRepositories.updateUser(user.id, {
        status: "REJECTED",
        approvalToken: null,
        rejectionReason: reason || "Ditolak oleh Administrator",
      });

      return {
        status: "REJECTED",
        message: `Pendaftaran akun ${user.name} telah ditolak.`,
        user: toPublic(updated),
      };
    }
  }
}
