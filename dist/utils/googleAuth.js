"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyGoogleIdToken = void 0;
const exceptions_1 = require("../exceptions");
/**
 * Verifikasi Google ID Token menggunakan Google OAuth2 Tokeninfo Endpoint.
 * Native fetch digunakan sehingga tidak memerlukan dependensi npm tambahan.
 */
const verifyGoogleIdToken = async (idToken) => {
    if (!idToken || typeof idToken !== "string" || idToken.trim().length === 0) {
        throw new exceptions_1.AuthenticationError("Google ID Token tidak valid");
    }
    try {
        const baseUrl = process.env.GOOGLE_TOKEN_INFO_URL ??
            "https://oauth2.googleapis.com/tokeninfo";
        const url = `${baseUrl}?id_token=${encodeURIComponent(idToken.trim())}`;
        const response = (await fetch(url));
        if (!response.ok) {
            throw new exceptions_1.AuthenticationError("Google ID Token tidak valid atau telah kedaluwarsa");
        }
        const payload = (await response.json());
        if (payload.error) {
            throw new exceptions_1.AuthenticationError("Google ID Token tidak valid");
        }
        const validIssuers = ["https://accounts.google.com", "accounts.google.com"];
        if (!payload.iss || !validIssuers.includes(payload.iss)) {
            throw new exceptions_1.AuthenticationError("Penerbit Google ID Token tidak valid");
        }
        // Validasi Client ID jika dikonfigurasi di environment
        const configuredClientId = process.env.GOOGLE_CLIENT_ID;
        if (configuredClientId && payload.aud !== configuredClientId) {
            throw new exceptions_1.AuthenticationError("Google ID Token tidak sesuai dengan Client ID aplikasi");
        }
        const isEmailVerified = payload.email_verified === "true" || payload.email_verified === true;
        if (!payload.email || !isEmailVerified) {
            throw new exceptions_1.AuthenticationError("Email Google belum diverifikasi");
        }
        return {
            email: payload.email,
            name: payload.name || payload.email.split("@")[0],
            picture: payload.picture,
            sub: payload.sub ?? "",
        };
    }
    catch (error) {
        if (error instanceof exceptions_1.AuthenticationError) {
            throw error;
        }
        throw new exceptions_1.AuthenticationError("Gagal memverifikasi Google ID Token");
    }
};
exports.verifyGoogleIdToken = verifyGoogleIdToken;
//# sourceMappingURL=googleAuth.js.map