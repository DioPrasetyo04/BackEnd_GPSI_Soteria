"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServices = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const exceptions_1 = require("../../../exceptions");
const helpers_1 = require("../../../utils/helpers");
const jwt_1 = require("../../../utils/jwt");
const googleAuth_1 = require("../../../utils/googleAuth");
const facebookAuth_1 = require("../../../utils/facebookAuth");
const mailer_1 = require("../../../utils/mailer");
const nanoid_1 = require("nanoid");
const RolePermissionRepository_1 = require("../../permission/repositories/RolePermissionRepository");
const Permissions_1 = require("../../../types/Permissions");
const rolePermRepo = new RolePermissionRepository_1.RolePermissionRepository();
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
class AuthServices {
    authRepository;
    userRepositories;
    constructor(authRepository, userRepositories) {
        this.authRepository = authRepository;
        this.userRepositories = userRepositories;
    }
    async resolveUserAuthInfo(user) {
        const userRole = (user.role || "PENGELOLA");
        const rawRoles = Array.isArray(user.roles)
            ? user.roles
            : [];
        const userRoles = Array.from(new Set([userRole, ...rawRoles].filter(Boolean)));
        const customPerms = Array.isArray(user.customPermissions)
            ? user.customPermissions
            : [];
        let permissions = [];
        try {
            const dynamicMap = await rolePermRepo.getAllRolePermissions();
            permissions = (0, Permissions_1.resolveEffectivePermissions)(userRoles, customPerms, dynamicMap);
        }
        catch {
            permissions = (0, Permissions_1.resolveEffectivePermissions)(userRoles, customPerms);
        }
        return {
            name: user.name,
            email: user.email,
            role: userRole,
            roles: userRoles,
            permissions,
            user: toPublic(user),
        };
    }
    async login(email, password) {
        const findUser = await this.userRepositories.getUserByEmail(email);
        if (!findUser) {
            throw new exceptions_1.AuthenticationError("Email atau password salah");
        }
        const comparePassword = await bcryptjs_1.default.compare(password, findUser.password);
        if (!comparePassword) {
            throw new exceptions_1.AuthenticationError("Email atau password salah");
        }
        // Pengecekan status approval pengguna
        if (findUser.status === "PENDING") {
            const err = new exceptions_1.AuthenticationError("Akun Anda sedang menunggu persetujuan dan verifikasi dari Administrator.");
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
            const err = new exceptions_1.AuthenticationError(findUser.rejectionReason
                ? `Pendaftaran akun Anda ditolak: ${findUser.rejectionReason}`
                : "Pendaftaran akun Anda ditolak oleh Administrator. Hubungi sekretariat gereja.");
            err.code = "ACCOUNT_REJECTED";
            throw err;
        }
        const { token, refreshToken, expiresAt } = (0, jwt_1.generateAuthTokens)(findUser.id);
        const authSession = await this.authRepository.saveSession(findUser.id, token, expiresAt);
        const authInfo = await this.resolveUserAuthInfo(findUser);
        return {
            ...authSession,
            refreshToken,
            ...authInfo,
        };
    }
    async googleLogin(idToken) {
        const googleUser = await (0, googleAuth_1.verifyGoogleIdToken)(idToken);
        // 1. Cek apakah user sudah terdaftar di database berdasarkan email Google
        let user = await this.userRepositories.getUserByEmail(googleUser.email);
        // 2. Jika belum ada, buat user baru dengan password acak aman
        if (!user) {
            const randomSecret = `G_${(0, nanoid_1.nanoid)(32)}_${Date.now()}`;
            const randomHashedPassword = await bcryptjs_1.default.hash(randomSecret, 10);
            const newUser = await this.userRepositories.createUser({
                name: googleUser.name,
                email: googleUser.email,
                password: randomHashedPassword,
                role: "PENGELOLA",
                roles: ["PENGELOLA"],
                status: "APPROVED",
            });
            user = newUser;
        }
        // 3. Terbitkan application JWT & Refresh Token dan simpan sesi aktif di database
        const { token, refreshToken, expiresAt } = (0, jwt_1.generateAuthTokens)(user.id);
        const authSession = await this.authRepository.saveSession(user.id, token, expiresAt);
        const authInfo = await this.resolveUserAuthInfo(user);
        return {
            ...authSession,
            refreshToken,
            ...authInfo,
        };
    }
    async facebookLogin(accessToken) {
        const fbUser = await (0, facebookAuth_1.verifyFacebookAccessToken)(accessToken);
        // 1. Cek apakah user sudah terdaftar berdasarkan email Facebook
        let user = await this.userRepositories.getUserByEmail(fbUser.email);
        // 2. Jika belum ada, buat user baru dengan password acak aman
        if (!user) {
            const randomSecret = `FB_${(0, nanoid_1.nanoid)(32)}_${Date.now()}`;
            const randomHashedPassword = await bcryptjs_1.default.hash(randomSecret, 10);
            const newUser = await this.userRepositories.createUser({
                name: fbUser.name,
                email: fbUser.email,
                password: randomHashedPassword,
                role: "PENGELOLA",
                roles: ["PENGELOLA"],
                status: "APPROVED",
            });
            user = newUser;
        }
        // 3. Terbitkan application JWT & Refresh Token dan simpan sesi aktif di database
        const { token, refreshToken, expiresAt } = (0, jwt_1.generateAuthTokens)(user.id);
        const authSession = await this.authRepository.saveSession(user.id, token, expiresAt);
        const authInfo = await this.resolveUserAuthInfo(user);
        return {
            ...authSession,
            refreshToken,
            ...authInfo,
        };
    }
    async refreshToken(tokenInput) {
        if (!tokenInput ||
            typeof tokenInput !== "string" ||
            tokenInput.trim().length === 0) {
            throw new exceptions_1.AuthenticationError("Token atau refresh token wajib disertakan");
        }
        const cleanToken = tokenInput.trim();
        let userId;
        // 1. Coba verifikasi apakah token ini merupakan dedicated Refresh Token
        try {
            const decodedRefresh = (0, jwt_1.verifyRefreshToken)(cleanToken);
            userId = decodedRefresh.id || decodedRefresh.data?.id;
        }
        catch {
            // 2. Jika bukan refresh token, coba decode sebagai access token
            try {
                const decodedAccess = (0, jwt_1.verifyJwtToken)(cleanToken);
                userId = decodedAccess.id || decodedAccess.data?.id;
            }
            catch {
                const decodedFallback = (0, jwt_1.decodeJwtToken)(cleanToken);
                if (decodedFallback &&
                    (decodedFallback.id || decodedFallback.data?.id)) {
                    userId = decodedFallback.id || decodedFallback.data?.id;
                }
            }
        }
        if (!userId) {
            throw new exceptions_1.AuthenticationError("Token atau refresh token tidak valid atau telah kedaluwarsa");
        }
        // 3. Pastikan pengguna masih terdaftar di sistem
        const user = await this.userRepositories.getUser(userId);
        if (!user) {
            throw new exceptions_1.AuthenticationError("Pengguna tidak ditemukan");
        }
        // 4. Pastikan sesi login aktif pengguna di database masih ada (belum logout)
        const activeSession = await this.authRepository.findByUserId(userId);
        if (!activeSession) {
            throw new exceptions_1.AuthenticationError("Sesi login tidak ditemukan atau Anda telah logout, silakan login kembali");
        }
        // 5. Terbitkan pasangan token baru (Token Rotation)
        const { token: newAccessToken, refreshToken: newRefreshToken, expiresAt: newExpiresAt, } = (0, jwt_1.generateAuthTokens)(userId);
        // 6. Simpan sesi aktif baru ke database
        const updatedSession = await this.authRepository.saveSession(userId, newAccessToken, newExpiresAt);
        const authInfo = await this.resolveUserAuthInfo(user);
        return {
            ...updatedSession,
            refreshToken: newRefreshToken,
            ...authInfo,
        };
    }
    async logout(tokenOrUserId) {
        if (!tokenOrUserId) {
            throw new exceptions_1.AuthenticationError("Token login not found");
        }
        await this.authRepository.logout(tokenOrUserId);
    }
    async register(data) {
        // 1. Validasi format email
        if (!(0, helpers_1.isValidEmail)(data.email)) {
            throw new exceptions_1.InvariantError("Format email tidak valid");
        }
        // 2. Cek keunikan email
        const existingUser = await this.userRepositories.getUserByEmail(data.email);
        if (existingUser) {
            throw new exceptions_1.InvariantError("Email sudah digunakan oleh user lain");
        }
        if (!data.password || data.password.length < 8) {
            throw new exceptions_1.InvariantError("Password harus diisi dan memiliki panjang minimal 8 karakter");
        }
        const SALT_ROUNDS = parseInt(process.env.HASH_ROUNDS) || 10;
        // 3. Hash password sebelum disimpan ke DB
        const hashedPassword = await bcryptjs_1.default.hash(String(data.password), SALT_ROUNDS);
        if (!hashedPassword) {
            throw new exceptions_1.InvariantError("Hash password gagal dilakukan");
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
        const assignedRole = data.role && validRoles.includes(data.role)
            ? data.role
            : "PENGELOLA";
        const approvalToken = `apr_${(0, nanoid_1.nanoid)(32)}`;
        const now = new Date();
        const newUser = await this.userRepositories.createUser({
            name: data.name,
            email: data.email,
            password: hashedPassword,
            role: assignedRole,
            roles: [assignedRole],
            status: "PENDING",
            approvalToken,
            lastNotificationSentAt: now,
        });
        // Kirimkan notifikasi email ke Admin/Pengelola yang sudah aktif
        this.userRepositories
            .getAllUser()
            .then((users) => {
            const adminEmails = users
                .filter((u) => (u.role === "ADMIN" ||
                u.role === "SUPER_ADMIN" ||
                u.role === "PENGELOLA") &&
                u.status === "APPROVED")
                .map((u) => u.email);
            (0, mailer_1.sendAdminApprovalNotification)({
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
    async resendApproval(email) {
        if (!email || !(0, helpers_1.isValidEmail)(email)) {
            throw new exceptions_1.InvariantError("Format email tidak valid");
        }
        const user = await this.userRepositories.getUserByEmail(email);
        if (!user) {
            throw new exceptions_1.InvariantError("Pengguna dengan email tersebut tidak ditemukan");
        }
        if (user.status === "APPROVED") {
            throw new exceptions_1.InvariantError("Akun ini sudah disetujui, silakan login ke portal");
        }
        if (user.status === "REJECTED") {
            throw new exceptions_1.InvariantError("Pendaftaran akun ini telah ditolak oleh Administrator.");
        }
        // Rate Limiting Check (Minimal jeda 60 detik)
        const now = new Date();
        const COOLDOWN_SECONDS = 60;
        if (user.lastNotificationSentAt) {
            const elapsed = Math.floor((now.getTime() - new Date(user.lastNotificationSentAt).getTime()) /
                1000);
            if (elapsed < COOLDOWN_SECONDS) {
                const remaining = COOLDOWN_SECONDS - elapsed;
                const err = new exceptions_1.ClientError(`Harap tunggu ${remaining} detik sebelum mengirim ulang notifikasi.`, 429);
                err.data = { remainingSeconds: remaining };
                throw err;
            }
        }
        let token = user.approvalToken;
        if (!token) {
            token = `apr_${(0, nanoid_1.nanoid)(32)}`;
        }
        await this.userRepositories.updateUser(user.id, {
            approvalToken: token,
            lastNotificationSentAt: now,
        });
        const allUsers = await this.userRepositories.getAllUser();
        const adminEmails = allUsers
            .filter((u) => (u.role === "ADMIN" ||
            u.role === "SUPER_ADMIN" ||
            u.role === "PENGELOLA") &&
            u.status === "APPROVED")
            .map((u) => u.email);
        (0, mailer_1.sendAdminApprovalNotification)({
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
            message: "Notifikasi verifikasi berhasil dikirimkan ulang ke Administrator",
            nextAllowedSeconds: COOLDOWN_SECONDS,
        };
    }
    async getApprovalInfo(token) {
        if (!token) {
            throw new exceptions_1.InvariantError("Token verifikasi wajib disertakan");
        }
        const user = await this.userRepositories.getUserByApprovalToken(token);
        if (!user) {
            throw new exceptions_1.InvariantError("Tautan verifikasi tidak valid atau telah kedaluwarsa.");
        }
        return toPublic(user);
    }
    async processApproval(token, action, reason) {
        if (!token) {
            throw new exceptions_1.InvariantError("Token verifikasi wajib disertakan");
        }
        const user = await this.userRepositories.getUserByApprovalToken(token);
        if (!user) {
            throw new exceptions_1.InvariantError("Tautan verifikasi tidak valid atau telah kedaluwarsa.");
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
        }
        else {
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
exports.AuthServices = AuthServices;
//# sourceMappingURL=AuthServices.js.map