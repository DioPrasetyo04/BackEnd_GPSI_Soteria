"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyFacebookAccessToken = void 0;
const exceptions_1 = require("../exceptions");
/**
 * Verifikasi Facebook User Access Token menggunakan Facebook Graph API.
 * Menggunakan native fetch sehingga tidak memerlukan dependensi npm tambahan.
 */
const verifyFacebookAccessToken = async (accessToken) => {
    if (!accessToken ||
        typeof accessToken !== "string" ||
        accessToken.trim().length === 0) {
        throw new exceptions_1.AuthenticationError("Facebook Access Token tidak valid");
    }
    try {
        const baseUrl = process.env.FACEBOOK_GRAPH_URL ?? "https://graph.facebook.com/v19.0/me";
        const url = `${baseUrl}?fields=id,name,email,picture.type(large)&access_token=${encodeURIComponent(accessToken.trim())}`;
        const response = (await fetch(url));
        const payload = (await response.json());
        if (!response.ok || payload.error) {
            const errorMsg = payload.error?.message ??
                "Facebook Access Token tidak valid atau telah kedaluwarsa";
            throw new exceptions_1.AuthenticationError(errorMsg);
        }
        if (!payload.id) {
            throw new exceptions_1.AuthenticationError("Identitas akun Facebook tidak valid");
        }
        if (!payload.email) {
            throw new exceptions_1.AuthenticationError("Akun Facebook Anda tidak membagikan alamat email. Pastikan Anda mengizinkan akses email pada saat login.");
        }
        return {
            id: payload.id,
            name: payload.name || "Facebook User",
            email: payload.email,
            picture: payload.picture?.data?.url,
        };
    }
    catch (error) {
        if (error instanceof exceptions_1.AuthenticationError) {
            throw error;
        }
        throw new exceptions_1.AuthenticationError("Gagal memverifikasi Facebook Access Token");
    }
};
exports.verifyFacebookAccessToken = verifyFacebookAccessToken;
//# sourceMappingURL=facebookAuth.js.map