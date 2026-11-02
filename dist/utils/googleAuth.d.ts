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
export declare const verifyGoogleIdToken: (idToken: string) => Promise<GooglePayload>;
//# sourceMappingURL=googleAuth.d.ts.map