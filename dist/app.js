"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const database_1 = require("./config/database");
const node_path_1 = __importDefault(require("node:path"));
// Routes
const AuthRoutes_1 = __importDefault(require("./services/authentication/routes/AuthRoutes"));
const index_1 = __importDefault(require("./services/user/index"));
const RolePermissionRoutes_1 = __importDefault(require("./services/permission/routes/RolePermissionRoutes"));
const RenunganRoutes_1 = __importDefault(require("./services/renungan/routes/RenunganRoutes"));
const JadwalRoutes_1 = __importDefault(require("./services/jadwal/routes/JadwalRoutes"));
const GalleryRoutes_1 = __importDefault(require("./services/gallery/routes/GalleryRoutes"));
const OrganizationRoutes_1 = __importDefault(require("./services/organization/routes/OrganizationRoutes"));
const WartaRoutes_1 = __importDefault(require("./services/warta/routes/WartaRoutes"));
const DashboardRoutes_1 = __importDefault(require("./services/dashboard/routes/DashboardRoutes"));
// Middlewares
const Errors_1 = __importDefault(require("./middlewares/Errors"));
const app = (0, express_1.default)();
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
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.includes(origin) ||
            /^https?:\/\/localhost(:\d+)?$/.test(origin) ||
            /\.vercel\.app$/.test(origin)) {
            return callback(null, true);
        }
        return callback(null, false);
    },
    credentials: true,
}));
// ─── STATIC FILES ───────────────────────────────────────────────────────────
// Akses file/gambar publik, contoh: http://localhost:3000/public/images/xxx.png
app.use("/public", express_1.default.static(node_path_1.default.join(process.cwd(), "public")));
// ─── BODY PARSERS ───────────────────────────────────────────────────────────
// Express 5 sudah bundle express.json() dan express.urlencoded().
// body-parser terpisah TIDAK diperlukan lagi (menghindari konflik).
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ extended: true }));
// ─── HEALTH CHECK ───────────────────────────────────────────────────────────
const healthCheck = (_req, res) => {
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
const soteriaV1 = express_1.default.Router();
soteriaV1.use("/auth", AuthRoutes_1.default);
soteriaV1.use("/dashboard", DashboardRoutes_1.default);
soteriaV1.use("/users", index_1.default);
soteriaV1.use("/roles-permissions", RolePermissionRoutes_1.default);
soteriaV1.use("/renungan", RenunganRoutes_1.default);
soteriaV1.use("/jadwal", JadwalRoutes_1.default);
soteriaV1.use("/gallery", GalleryRoutes_1.default);
soteriaV1.use("/galeri", GalleryRoutes_1.default);
soteriaV1.use("/organization", OrganizationRoutes_1.default);
soteriaV1.use("/warta", WartaRoutes_1.default);
app.use("/api/soteria/v1", soteriaV1);
// Direct fallback namespace (/auth/*)
app.use("/auth", AuthRoutes_1.default);
// Standard API namespace (/api/*)
app.use("/api/auth", AuthRoutes_1.default);
app.use("/api/dashboard", DashboardRoutes_1.default);
app.use("/api/users", index_1.default);
app.use("/api/roles-permissions", RolePermissionRoutes_1.default);
app.use("/api/renungan", RenunganRoutes_1.default);
app.use("/api/jadwal", JadwalRoutes_1.default);
app.use("/api/gallery", GalleryRoutes_1.default);
app.use("/api/organization", OrganizationRoutes_1.default);
app.use("/api/warta", WartaRoutes_1.default);
// ─── GLOBAL ERROR HANDLER ───────────────────────────────────────────────────
// HARUS di-register SETELAH semua routes.
// Middleware dengan 4 parameter dikenali Express sebagai error handler.
app.use(Errors_1.default);
// ─── EXPORT app (untuk Vercel serverless) ───────────────────────────────────
exports.default = app;
// ─── START SERVER (hanya saat dijalankan langsung, bukan di Vercel/serverless) ─
const isServerless = process.env.VERCEL === "1" ||
    Boolean(process.env.VERCEL_ENV) ||
    Boolean(process.env.NOW_REGION) ||
    Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME) ||
    Boolean(process.env.LAMBDA_TASK_ROOT);
if (!isServerless && process.env.NODE_ENV !== "test") {
    const HOST = String(process.env.HOST || "localhost");
    const PORT = parseInt(process.env.PORT || "3005", 10);
    (0, database_1.ConnectDatabase)()
        .catch((err) => console.error("Initial DB connection failed:", err))
        .finally(() => {
        app.listen(PORT, HOST, () => {
            console.log(`🚀 Server is running on http://${HOST}:${PORT}`);
        });
    });
}
//# sourceMappingURL=app.js.map