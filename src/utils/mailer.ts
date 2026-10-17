import nodemailer from "nodemailer";

const smtpUser =
  process.env.SMTIP_GMAIL_USERNAME ||
  process.env.SMTP_GMAIL_USERNAME ||
  "prasetyodio04@gmail.com";
const smtpPass = process.env.SMTP_GMAIL_PASSWORD || "";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: smtpUser,
    pass: smtpPass,
  },
});

export interface ApprovalEmailPayload {
  adminEmails: string[];
  applicant: {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt?: Date;
  };
  approvalToken: string;
}

export async function sendAdminApprovalNotification({
  adminEmails,
  applicant,
  approvalToken,
}: ApprovalEmailPayload): Promise<boolean> {
  const frontendBaseUrl =
    process.env.FRONTEND_URL ||
    (process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(",")[0].trim()
      : "http://localhost:5173");

  const approveUrl = `${frontendBaseUrl}/auth/verify-approval?token=${approvalToken}&action=approve`;
  const rejectUrl = `${frontendBaseUrl}/auth/verify-approval?token=${approvalToken}&action=reject`;

  const targetEmails =
    adminEmails.length > 0 ? adminEmails : [smtpUser];

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

    const info = await transporter.sendMail({
      from: `"GPSI Soteria Portal" <${smtpUser}>`,
      to: targetEmails.join(", "),
      subject: `[GPSI Soteria] Permohonan Pendaftaran Akun: ${applicant.name} (${applicant.role})`,
      html,
    });

    console.log("Approval notification email sent:", info.messageId);
    return true;
  } catch (error) {
    console.error("Failed to send approval notification email:", error);
    return false;
  }
}
