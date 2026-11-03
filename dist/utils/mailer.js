"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transporter = void 0;
exports.resolveFrontendBaseUrl = resolveFrontendBaseUrl;
exports.sendAdminApprovalNotification = sendAdminApprovalNotification;
exports.sendForgotPasswordNotification = sendForgotPasswordNotification;
const nodemailer_1 = __importDefault(require("nodemailer"));
const node_path_1 = __importDefault(require("node:path"));
const node_fs_1 = __importDefault(require("node:fs"));
const smtpUser = process.env.SMTIP_GMAIL_USERNAME ||
    process.env.SMTP_GMAIL_USERNAME ||
    "prasetyodio04@gmail.com";
const smtpPass = process.env.SMTP_GMAIL_PASSWORD || "";
exports.transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: smtpUser,
        pass: smtpPass,
    },
});
/**
 * Resolves the frontend base URL dynamically with fallback priority:
 * 1. Explicit baseUrl passed from the incoming request (Origin / Referer / x-frontend-url header)
 * 2. ADMIN_FRONTEND_URL or FRONTEND_URL environment variable
 * 3. Any non-localhost deployed origin found in CORS_ORIGIN (e.g., https://*.vercel.app)
 * 4. Localhost fallback
 */
function resolveFrontendBaseUrl(providedUrl) {
    const envAdminUrl = (process.env.ADMIN_FRONTEND_URL ||
        process.env.FRONTEND_URL ||
        "")
        .trim()
        .replace(/\/+$/, "");
    // 1. If explicit URL is provided from request and is a live non-localhost origin
    if (providedUrl && typeof providedUrl === "string") {
        const trimmed = providedUrl.trim().replace(/\/+$/, "");
        if (trimmed && !trimmed.includes("localhost") && !trimmed.includes("127.0.0.1")) {
            return trimmed;
        }
    }
    // 2. If ADMIN_FRONTEND_URL or FRONTEND_URL is explicitly set in environment variables
    if (envAdminUrl) {
        return envAdminUrl;
    }
    // 3. Scan CORS_ORIGIN for any deployed / Vercel origin (*.vercel.app or https://)
    const isProduction = process.env.NODE_ENV === "production" ||
        process.env.VERCEL === "1" ||
        Boolean(process.env.VERCEL_ENV);
    const corsOrigins = (process.env.CORS_ORIGIN || "")
        .split(",")
        .map((s) => s.trim().replace(/\/+$/, ""))
        .filter(Boolean);
    const deployedOrigin = corsOrigins.find((o) => !o.includes("localhost") &&
        !o.includes("127.0.0.1") &&
        (o.includes("vercel.app") || o.startsWith("https://")));
    if (deployedOrigin && (isProduction || !providedUrl || providedUrl.includes("localhost"))) {
        return deployedOrigin;
    }
    // 4. If request provided a URL (even localhost during local development)
    if (providedUrl && typeof providedUrl === "string") {
        const trimmed = providedUrl.trim().replace(/\/+$/, "");
        if (trimmed)
            return trimmed;
    }
    // 5. Fallback to first origin in CORS_ORIGIN or default localhost:5173
    return corsOrigins[0] || "http://localhost:5173";
}
function getLogoConfig(frontendBaseUrl) {
    const candidatePaths = [
        node_path_1.default.join(process.cwd(), "public", "images", "logo-gpsi.png"),
        node_path_1.default.join(process.cwd(), "BackEnd", "public", "images", "logo-gpsi.png"),
        node_path_1.default.resolve(__dirname, "../../public/images/logo-gpsi.png"),
        node_path_1.default.resolve(__dirname, "../../../BackEnd/public/images/logo-gpsi.png"),
        node_path_1.default.resolve(__dirname, "../../../FrontEnd/gpsi-soteria/public/images/logo-gpsi.png"),
        node_path_1.default.resolve(__dirname, "../../../../FrontEnd/gpsi-soteria/public/images/logo-gpsi.png"),
    ];
    const foundPath = candidatePaths.find((p) => node_fs_1.default.existsSync(p));
    if (foundPath) {
        return {
            imgSrc: "cid:logo_gpsi",
            attachments: [
                {
                    filename: "logo-gpsi.png",
                    path: foundPath,
                    cid: "logo_gpsi",
                    contentType: "image/jpeg",
                },
            ],
        };
    }
    const fallbackUrl = process.env.LOGO_URL || `${frontendBaseUrl}/images/logo-gpsi.png`;
    return {
        imgSrc: fallbackUrl,
        attachments: [],
    };
}
async function sendAdminApprovalNotification({ adminEmails, applicant, approvalToken, baseUrl, }) {
    const frontendBaseUrl = resolveFrontendBaseUrl(baseUrl);
    const logoConfig = getLogoConfig(frontendBaseUrl);
    const approveUrl = `${frontendBaseUrl}/auth/verify-approval?token=${approvalToken}&action=approve`;
    const rejectUrl = `${frontendBaseUrl}/auth/verify-approval?token=${approvalToken}&action=reject`;
    const targetEmails = adminEmails.length > 0 ? adminEmails : [smtpUser];
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Verifikasi Pendaftaran Akun GPSI Soteria</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0f172a; color: #f8fafc; margin: 0; padding: 24px; }
    .container { max-width: 600px; margin: 0 auto; background: #1e293b; border-radius: 16px; border: 1px solid #334155; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4); }
    .header { background: linear-gradient(135deg, #4f46e5 0%, #312e81 100%); padding: 32px 24px; text-align: center; }
    .header h1 { margin: 0 0 8px 0; font-size: 24px; color: #ffffff; letter-spacing: -0.5px; }
    .header p { margin: 0; font-size: 14px; color: #c7d2fe; }
    .body { padding: 32px 24px; }
    .intro { font-size: 15px; line-height: 1.6; color: #cbd5e1; margin-bottom: 24px; }
    .card { background: #0f172a; border: 1px solid #334155; border-radius: 12px; padding: 20px; margin-bottom: 28px; }
    .item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #1e293b; font-size: 14px; }
    .item:last-child { border-bottom: none; }
    .label { color: #94a3b8; font-weight: 500; }
    .val { color: #f1f5f9; font-weight: 600; text-align: right; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 700; background: #3730a3; color: #c7d2fe; }
    .cta-container { display: flex; gap: 12px; margin: 28px 0; justify-content: center; }
    .btn { display: inline-block; padding: 12px 24px; text-decoration: none; border-radius: 10px; font-size: 14px; font-weight: 600; text-align: center; transition: all 0.2s; }
    .btn-approve { background: #10b981; color: #ffffff; margin-right: 8px; }
    .btn-reject { background: #ef4444; color: #ffffff; }
    .footer { padding: 20px 24px; background: #0f172a; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #1e293b; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div style="margin-bottom: 16px; text-align: center;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto; border-collapse: collapse;">
          <tr>
            <td style="background-color: #ffffff; border-radius: 12px; padding: 6px 14px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25); text-align: center;">
              <img src="${logoConfig.imgSrc}" alt="Logo GPSI Soteria" width="68" height="55" style="display: block; width: 68px; height: 55px; border: 0; outline: none; text-decoration: none; margin: 0 auto;" />
            </td>
          </tr>
        </table>
      </div>
      <h1>GPSI Soteria</h1>
      <p>Portal Manajemen Administrator & Pelayanan Jemaat</p>
    </div>
    <div class="body">
      <p class="intro">
        Halo Administrator / Pengelola GPSI Soteria,<br>
        Terdapat permohonan pendaftaran akun pengguna baru yang memerlukan verifikasi dan persetujuan Anda:
      </p>

      <div class="card">
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="border-bottom: 1px solid #334155;">
            <td style="padding: 10px 0; color: #94a3b8; font-size: 14px;">Nama Lengkap</td>
            <td style="padding: 10px 0; color: #ffffff; font-weight: 600; text-align: right; font-size: 14px;">${applicant.name}</td>
          </tr>
          <tr style="border-bottom: 1px solid #334155;">
            <td style="padding: 10px 0; color: #94a3b8; font-size: 14px;">Alamat Email</td>
            <td style="padding: 10px 0; color: #ffffff; font-weight: 600; text-align: right; font-size: 14px;">${applicant.email}</td>
          </tr>
          <tr style="border-bottom: 1px solid #334155;">
            <td style="padding: 10px 0; color: #94a3b8; font-size: 14px;">Peran Diajukan</td>
            <td style="padding: 10px 0; text-align: right;">
              <span style="background: #3730a3; color: #c7d2fe; padding: 3px 8px; border-radius: 6px; font-size: 12px; font-weight: bold;">${applicant.role}</span>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #94a3b8; font-size: 14px;">Waktu Pendaftaran</td>
            <td style="padding: 10px 0; color: #94a3b8; text-align: right; font-size: 13px;">${new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })} WIB</td>
          </tr>
        </table>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${approveUrl}" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-right: 12px; display: inline-block;">
          ✓ Verifikasi & Setujui
        </a>
        <a href="${rejectUrl}" style="background-color: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
          ✕ Tolak Pendaftaran
        </a>
      </div>

      <p style="font-size: 12px; color: #64748b; line-height: 1.5; text-align: center;">
        Tautan di atas berlaku untuk satu kali aksi verifikasi. Jika Anda tidak mengenali pendaftar ini, Anda dapat menekan tombol Tolak.
      </p>
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} Gereja Pantekosta Soteria Indonesia (GPSI Soteria). All rights reserved.
    </div>
  </div>
</body>
</html>
`;
    try {
        if (!smtpPass) {
            console.warn("SMTP_GMAIL_PASSWORD is not set. Skipping actual email delivery.");
            return false;
        }
        const info = await exports.transporter.sendMail({
            from: `"GPSI Soteria Portal" <${smtpUser}>`,
            to: targetEmails.join(", "),
            subject: `[GPSI Soteria] Permohonan Pendaftaran Akun: ${applicant.name} (${applicant.role})`,
            html,
            attachments: logoConfig.attachments,
        });
        console.log("Approval notification email sent:", info.messageId);
        return true;
    }
    catch (error) {
        console.error("Failed to send approval notification email:", error);
        return false;
    }
}
async function sendForgotPasswordNotification({ email, name, resetToken, baseUrl, }) {
    const frontendBaseUrl = resolveFrontendBaseUrl(baseUrl);
    const logoConfig = getLogoConfig(frontendBaseUrl);
    const resetUrl = `${frontendBaseUrl}/auth/reset-password?token=${encodeURIComponent(resetToken)}`;
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Permintaan Atur Ulang Kata Sandi - GPSI Soteria</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0f172a; color: #f8fafc; margin: 0; padding: 24px; }
    .container { max-width: 600px; margin: 0 auto; background: #1e293b; border-radius: 16px; border: 1px solid #334155; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4); }
    .header { background: linear-gradient(135deg, #4f46e5 0%, #312e81 100%); padding: 32px 24px; text-align: center; }
    .header h1 { margin: 0 0 8px 0; font-size: 24px; color: #ffffff; letter-spacing: -0.5px; }
    .header p { margin: 0; font-size: 14px; color: #c7d2fe; }
    .body { padding: 32px 24px; }
    .intro { font-size: 15px; line-height: 1.6; color: #cbd5e1; margin-bottom: 24px; }
    .card { background: #0f172a; border: 1px solid #334155; border-radius: 12px; padding: 20px; margin-bottom: 24px; }
    .alert-box { background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 10px; padding: 14px; margin-top: 24px; color: #fca5a5; font-size: 13px; line-height: 1.5; }
    .footer { padding: 20px 24px; background: #0f172a; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #1e293b; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div style="margin-bottom: 16px; text-align: center;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto; border-collapse: collapse;">
          <tr>
            <td style="background-color: #ffffff; border-radius: 12px; padding: 6px 14px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25); text-align: center;">
              <img src="${logoConfig.imgSrc}" alt="Logo GPSI Soteria" width="68" height="55" style="display: block; width: 68px; height: 55px; border: 0; outline: none; text-decoration: none; margin: 0 auto;" />
            </td>
          </tr>
        </table>
      </div>
      <h1>GPSI Soteria</h1>
      <p>Portal Manajemen Administrator & Pelayanan Jemaat</p>
    </div>
    <div class="body">
      <p class="intro">
        Halo <strong>${name}</strong>,<br><br>
        Kami menerima permintaan untuk mengatur ulang kata sandi akun portal GPSI Soteria yang terhubung dengan alamat email <strong>${email}</strong>.
      </p>

      <div class="card" style="text-align: center; padding: 28px 20px;">
        <p style="margin: 0 0 20px 0; font-size: 14px; color: #94a3b8;">
          Silakan klik tombol di bawah ini untuk membuat kata sandi baru akun Anda:
        </p>
        <div>
          <a href="${resetUrl}" style="background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%); color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 10px; font-size: 15px; font-weight: bold; display: inline-block; box-shadow: 0 4px 14px rgba(79, 70, 229, 0.4);">
            🔑 Buat Kata Sandi Baru
          </a>
        </div>
        <p style="margin: 22px 0 0 0; font-size: 12px; color: #64748b;">
          Atau salin tautan berikut ke peramban Anda:<br>
          <a href="${resetUrl}" style="color: #818cf8; word-break: break-all; font-size: 12px;">${resetUrl}</a>
        </p>
      </div>

      <div class="alert-box">
        ⏱️ <strong>Masa Berlaku Penting:</strong> Tautan ini hanya berlaku selama <strong>15 menit</strong> terhitung sejak email ini dikirimkan.<br><br>
        🛡️ <strong>Catatan Keamanan:</strong> Jika Anda tidak pernah meminta pengaturan ulang kata sandi, abaikan email ini. Kata sandi akun Anda tetap aman dan tidak akan berubah.
      </div>
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} Gereja Pantekosta Soteria Indonesia (GPSI Soteria). All rights reserved.
    </div>
  </div>
</body>
</html>
`;
    try {
        if (!smtpPass) {
            console.warn("SMTP_GMAIL_PASSWORD is not set. Skipping actual email delivery.");
            return false;
        }
        const info = await exports.transporter.sendMail({
            from: `"GPSI Soteria Portal" <${smtpUser}>`,
            to: email,
            subject: `[GPSI Soteria] Permintaan Atur Ulang Kata Sandi Akun Anda`,
            html,
            attachments: logoConfig.attachments,
        });
        console.log("Forgot password reset email sent successfully:", info.messageId);
        return true;
    }
    catch (error) {
        console.error("Failed to send forgot password email:", error);
        return false;
    }
}
//# sourceMappingURL=mailer.js.map