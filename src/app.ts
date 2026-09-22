import "dotenv/config";
import express, { type Express, type Request, type Response } from "express";
import cors from "cors";
import { ConnectDatabase } from "./config/database";

import path from "node:path";

// all Routes
import allRoutes from "./services";

// Middlewares
import ErrorsHandler from "./middlewares/Errors";

const HOST = String(process.env.HOST || "localhost");
const PORT = parseInt(process.env.PORT || "3000", 10);

async function main() {
  const app: Express = express();

  // ─── CORS ───────────────────────────────────────────────────────────────────
  // origin: '*' dengan credentials: true DITOLAK browser secara default.
  // Ganti dengan origin yang spesifik.
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN || "http://localhost:5173",
      credentials: true,
    }),
  );

  // ─── STATIC FILES ───────────────────────────────────────────────────────────
  // Akses file/gambar publik, contoh: http://localhost:3000/public/images/xxx.png
  app.use("/public", express.static(path.join(process.cwd(), "public")));

  // ─── BODY PARSERS ───────────────────────────────────────────────────────────
  // Express 5 sudah bundle express.json() dan express.urlencoded().
  // body-parser terpisah TIDAK diperlukan lagi (menghindari konflik).
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));

  // ─── DATABASE ───────────────────────────────────────────────────────────────
  await ConnectDatabase();

  // ─── HEALTH CHECK ───────────────────────────────────────────────────────────
  app.get("/", (req: Request, res: Response) => {
    res.json({
      message: "Welcome to GPSI Soteria API",
      version: "1.0.0",
      status: "running",
    });
  });

  // ─── ROUTES ─────────────────────────────────────────────────────────────────
  app.use("/api/soteria/v1/", allRoutes);

  // ─── GLOBAL ERROR HANDLER ───────────────────────────────────────────────────
  // HARUS di-register SETELAH semua routes.
  // Middleware dengan 4 parameter dikenali Express sebagai error handler.
  app.use(ErrorsHandler);

  // ─── START SERVER ───────────────────────────────────────────────────────────
  app.listen(PORT, HOST, () => {
    console.log(`🚀 Server is running on http://${HOST}:${PORT}`);
  });
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});