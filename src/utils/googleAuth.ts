import { AuthenticationError } from "../exceptions";

export interface GooglePayload {
  email: string;
  name: string;
  picture?: string;
  sub: string;
}

/**
 * Verifikasi Google ID Token menggunakan Google OAuth2 Tokeninfo Endpoint.
 * Native fetch digunakan sehingga tidak memerlukan dependensi npm tambahan.
 */
export const verifyGoogleIdToken = async (
  idToken: string,
): Promise<GooglePayload> => {
  if (!idToken || typeof idToken !== "string" || idToken.trim().length === 0) {
    throw new AuthenticationError("Google ID Token tidak valid");
  }

  try {
    const baseUrl =
      process.env.GOOGLE_TOKEN_INFO_URL ??
      "https://oauth2.googleapis.com/tokeninfo";
    const url = `${baseUrl}?id_token=${encodeURIComponent(idToken.trim())}`;
    const response = await fetch(url);


    if (!response.ok) {
      throw new AuthenticationError(
        "Google ID Token tidak valid atau telah kedaluwarsa",
      );
    }

    const payload = (await response.json()) as {
      iss?: string;
      sub?: string;
      aud?: string;
      email?: string;
      email_verified?: string | boolean;
      name?: string;
      picture?: string;
      error?: string;
    };

    if (payload.error) {
      throw new AuthenticationError("Google ID Token tidak valid");
    }

    const validIssuers = ["https://accounts.google.com", "accounts.google.com"];
    if (!payload.iss || !validIssuers.includes(payload.iss)) {
      throw new AuthenticationError("Penerbit Google ID Token tidak valid");
    }

    // Validasi Client ID jika dikonfigurasi di environment
    const configuredClientId = process.env.GOOGLE_CLIENT_ID;
    if (configuredClientId && payload.aud !== configuredClientId) {
      throw new AuthenticationError(
        "Google ID Token tidak sesuai dengan Client ID aplikasi",
      );
    }

    const isEmailVerified =
      payload.email_verified === "true" || payload.email_verified === true;

    if (!payload.email || !isEmailVerified) {
      throw new AuthenticationError("Email Google belum diverifikasi");
    }

    return {
      email: payload.email,
      name: payload.name || payload.email.split("@")[0],
      picture: payload.picture,
      sub: payload.sub ?? "",
    };
  } catch (error) {
    if (error instanceof AuthenticationError) {
      throw error;
    }
    throw new AuthenticationError("Gagal memverifikasi Google ID Token");
  }
};
