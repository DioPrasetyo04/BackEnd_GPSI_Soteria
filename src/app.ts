import "dotenv/config";
import express, { type Express, type Request, type Response } from "express";
import cors from "cors";
import { ConnectDatabase } from "./config/database";

import path from "node:path";

// Routes
import authRoutes from "./services/authentication/routes/AuthRoutes";
import indexUserRoutes from "./services/user/index";
import rolePermissionRoutes from "./services/permission/routes/RolePermissionRoutes";
import renunganRoutes from "./services/renungan/routes/RenunganRoutes";
import jadwalRoutes from "./services/jadwal/routes/JadwalRoutes";
import galleryRoutes from "./services/gallery/routes/GalleryRoutes";
import organizationRoutes from "./services/organization/routes/OrganizationRoutes";
import wartaRoutes from "./services/warta/routes/WartaRoutes";
import dashboardRoutes from "./services/dashboard/routes/DashboardRoutes";

// Middlewares
import ErrorsHandler from "./middlewares/Errors";

const app: Express = express();

// ─── CORS ───────────────────────────────────────────────────────────────────
// Izinkan origin HTTP & HTTPS localhost untuk mendukung pengujian OAuth/Facebook SDK
const envOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const allowedOrigins = [
  "http://localhost:5173",
  "https://localhost:5173",
  ...envOrigins,
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        /^https?:\/\/localhost(:\d+)?$/.test(origin) ||
        /\.vercel\.app$/.test(origin)
      ) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    credentials: true,
  }),
);

// ─── STATIC FILES ───────────────────────────────────────────────────────────
// Akses file/gambar publik, contoh: http://localhost:3000/public/images/xxx.png
// Header CORS + Content-Disposition inline agar PDF bisa di-render pdf.js di mobile
app.use(
  "/public",
  express.static(path.join(process.cwd(), "public"), {
    setHeaders(res, filePath) {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");

      if (filePath.toLowerCase().endsWith(".pdf")) {
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "inline");
        res.setHeader("X-Content-Type-Options", "nosniff");
      }
    },
  }),
);

// ─── BODY PARSERS ───────────────────────────────────────────────────────────
// Express 5 sudah bundle express.json() dan express.urlencoded().
// body-parser terpisah TIDAK diperlukan lagi (menghindari konflik).
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ─── HEALTH CHECK ───────────────────────────────────────────────────────────
const healthCheck = (_req: Request, res: Response) => {
  res.json({
    message: "Welcome to GPSI Soteria API",
    version: "1.0.0",
    status: "running",
  });
};

app.get("/", healthCheck);
app.get("/api", healthCheck);

// ─── ROUTES ─────────────────────────────────────────────────────────────────
// Versioned API namespace used by frontends (/api/soteria/v1/*)
const soteriaV1 = express.Router();
soteriaV1.use("/auth", authRoutes);
soteriaV1.use("/dashboard", dashboardRoutes);
soteriaV1.use("/users", indexUserRoutes);
soteriaV1.use("/roles-permissions", rolePermissionRoutes);
soteriaV1.use("/renungan", renunganRoutes);
soteriaV1.use("/jadwal", jadwalRoutes);
soteriaV1.use("/gallery", galleryRoutes);
soteriaV1.use("/galeri", galleryRoutes);
soteriaV1.use("/organization", organizationRoutes);
soteriaV1.use("/warta", wartaRoutes);
app.use("/api/soteria/v1", soteriaV1);

// Direct fallback namespace (/auth/*)
app.use("/auth", authRoutes);

// Standard API namespace (/api/*)
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", indexUserRoutes);
app.use("/api/roles-permissions", rolePermissionRoutes);
app.use("/api/renungan", renunganRoutes);
app.use("/api/jadwal", jadwalRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/organization", organizationRoutes);
app.use("/api/warta", wartaRoutes);

// ─── GLOBAL ERROR HANDLER ───────────────────────────────────────────────────
// HARUS di-register SETELAH semua routes.
// Middleware dengan 4 parameter dikenali Express sebagai error handler.
app.use(ErrorsHandler);

// ─── EXPORT app (untuk Vercel serverless) ───────────────────────────────────
export default app;

// ─── START SERVER (hanya saat dijalankan langsung, bukan di Vercel/serverless) ─
const isServerless =
  process.env.VERCEL === "1" ||
  Boolean(process.env.VERCEL_ENV) ||
  Boolean(process.env.NOW_REGION) ||
  Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME) ||
  Boolean(process.env.LAMBDA_TASK_ROOT);

if (!isServerless && process.env.NODE_ENV !== "test") {
  const HOST = String(process.env.HOST || "localhost");
  const PORT = parseInt(process.env.PORT || "3005", 10);

  ConnectDatabase()
    .catch((err) => console.error("Initial DB connection failed:", err))
    .finally(() => {
      app.listen(PORT, HOST, () => {
        console.log(`🚀 Server is running on http://${HOST}:${PORT}`);
      });
    });
}
