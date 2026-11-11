import type { Request, Response, NextFunction } from "express";
import path from "node:path";
import fs from "node:fs";
import { InvariantError, NotFoundError } from "../../../exceptions";

const SUPABASE_HOST_SUFFIX = "supabase.co";
const ALLOWED_LOCAL_PREFIX = "/public/";

function getBackendOrigin(req: Request): string {
  const proto = (req.headers["x-forwarded-proto"] as string) || req.protocol;
  const host = req.get("host");
  return `${proto}://${host}`;
}

function isAllowedFileUrl(rawUrl: string, req: Request): boolean {
  if (!rawUrl || typeof rawUrl !== "string") return false;

  const trimmed = rawUrl.trim();

  if (trimmed.startsWith(ALLOWED_LOCAL_PREFIX)) {
    return !trimmed.includes("..");
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return false;
    }

    // Supabase Storage public URLs
    if (parsed.hostname.endsWith(SUPABASE_HOST_SUFFIX)) {
      return parsed.pathname.includes("/storage/v1/object/public/warta/");
    }

    // Same-origin local public files
    const origin = getBackendOrigin(req);
    if (trimmed.startsWith(`${origin}${ALLOWED_LOCAL_PREFIX}`)) {
      return !parsed.pathname.includes("..");
    }

    return false;
  } catch {
    return false;
  }
}

function setPdfResponseHeaders(res: Response, contentType?: string | null) {
  res.setHeader(
    "Content-Type",
    contentType && contentType.length > 0
      ? contentType
      : "application/pdf",
  );
  res.setHeader("Content-Disposition", "inline");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.setHeader("X-Content-Type-Options", "nosniff");
}

/**
 * Proxy berkas warta agar PDF dapat di-render oleh pdf.js di mobile/desktop.
 * Mencegah masalah CORS iframe/embed native browser (terutama iOS Safari).
 *
 * GET /api/warta/file?url=<encoded>
 * GET /api/soteria/v1/warta/file?url=<encoded>
 */
export const proxyWartaFile = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const rawUrl = String(req.query.url || "").trim();
    if (!rawUrl) {
      throw new InvariantError("Parameter url wajib diisi");
    }

    if (!isAllowedFileUrl(rawUrl, req)) {
      throw new InvariantError(
        "URL berkas tidak diizinkan. Hanya file warta publik yang dapat di-proxy.",
      );
    }

    // Serve local /public/... files directly from disk
    if (rawUrl.startsWith(ALLOWED_LOCAL_PREFIX)) {
      const cleanPath = rawUrl.replace(/^[/\\]+/, "");
      const fullPath = path.resolve(process.cwd(), cleanPath);
      const publicRoot = path.resolve(process.cwd(), "public");

      if (!fullPath.startsWith(publicRoot) || !fs.existsSync(fullPath)) {
        throw new NotFoundError("Berkas warta tidak ditemukan");
      }

      const ext = path.extname(fullPath).toLowerCase();
      const mime =
        ext === ".pdf"
          ? "application/pdf"
          : ext === ".png"
            ? "image/png"
            : ext === ".jpg" || ext === ".jpeg"
              ? "image/jpeg"
              : ext === ".webp"
                ? "image/webp"
                : ext === ".gif"
                  ? "image/gif"
                  : "application/octet-stream";

      setPdfResponseHeaders(res, mime);
      fs.createReadStream(fullPath).pipe(res);
      return;
    }

    // Absolute same-origin /public URL → resolve to local path
    try {
      const parsed = new URL(rawUrl);
      const origin = getBackendOrigin(req);
      if (
        rawUrl.startsWith(`${origin}${ALLOWED_LOCAL_PREFIX}`) &&
        parsed.pathname.startsWith(ALLOWED_LOCAL_PREFIX)
      ) {
        const cleanPath = parsed.pathname.replace(/^[/\\]+/, "");
        const fullPath = path.resolve(process.cwd(), cleanPath);
        const publicRoot = path.resolve(process.cwd(), "public");

        if (!fullPath.startsWith(publicRoot) || !fs.existsSync(fullPath)) {
          throw new NotFoundError("Berkas warta tidak ditemukan");
        }

        setPdfResponseHeaders(
          res,
          path.extname(fullPath).toLowerCase() === ".pdf"
            ? "application/pdf"
            : undefined,
        );
        fs.createReadStream(fullPath).pipe(res);
        return;
      }
    } catch (err) {
      if (err instanceof NotFoundError || err instanceof InvariantError) {
        throw err;
      }
    }

    // Remote (Supabase) — fetch and stream
    const upstream = await fetch(rawUrl, {
      method: "GET",
      headers: {
        Accept: "application/pdf,image/*,*/*",
      },
      redirect: "follow",
    });

    if (!upstream.ok) {
      throw new NotFoundError(
        `Berkas warta tidak dapat diambil (status ${upstream.status})`,
      );
    }

    const contentType =
      upstream.headers.get("content-type") || "application/pdf";
    setPdfResponseHeaders(res, contentType);

    const contentLength = upstream.headers.get("content-length");
    if (contentLength) {
      res.setHeader("Content-Length", contentLength);
    }

    const buffer = Buffer.from(await upstream.arrayBuffer());
    res.send(buffer);
  } catch (error) {
    next(error);
  }
};
