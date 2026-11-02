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
export declare const verifyFacebookAccessToken: (accessToken: string) => Promise<FacebookPayload>;
//# sourceMappingURL=facebookAuth.d.ts.map