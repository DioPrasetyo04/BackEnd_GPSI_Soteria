import { AuthenticationError } from "../exceptions";

export interface FacebookPayload {
  id: string;
  name: string;
  email: string;
  picture?: string;
}

/**
 * Verifikasi Facebook User Access Token menggunakan Facebook Graph API.
 * Menggunakan native fetch sehingga tidak memerlukan dependensi npm tambahan.
 */
export const verifyFacebookAccessToken = async (
  accessToken: string,
): Promise<FacebookPayload> => {
  if (
    !accessToken ||
    typeof accessToken !== "string" ||
    accessToken.trim().length === 0
  ) {
    throw new AuthenticationError("Facebook Access Token tidak valid");
  }

  try {
    const baseUrl =
      process.env.FACEBOOK_GRAPH_URL ?? "https://graph.facebook.com/v19.0/me";

    const url = `${baseUrl}?fields=id,name,email,picture.type(large)&access_token=${encodeURIComponent(accessToken.trim())}`;
    const response = await fetch(url);

    const payload = (await response.json()) as {
      id?: string;
      name?: string;
      email?: string;
      picture?: {
        data?: {
          url?: string;
        };
      };
      error?: {
        message?: string;
        type?: string;
        code?: number;
      };
    };

    if (!response.ok || payload.error) {
      const errorMsg =
        payload.error?.message ??
        "Facebook Access Token tidak valid atau telah kedaluwarsa";
      throw new AuthenticationError(errorMsg);
    }

    if (!payload.id) {
      throw new AuthenticationError("Identitas akun Facebook tidak valid");
    }

    if (!payload.email) {
      throw new AuthenticationError(
        "Akun Facebook Anda tidak membagikan alamat email. Pastikan Anda mengizinkan akses email pada saat login.",
      );
    }

    return {
      id: payload.id,
      name: payload.name || "Facebook User",
      email: payload.email,
      picture: payload.picture?.data?.url,
    };
  } catch (error) {
    if (error instanceof AuthenticationError) {
      throw error;
    }
    throw new AuthenticationError("Gagal memverifikasi Facebook Access Token");
  }
};
