import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import responses from "../utils/response";
import { deleteUploadedFile } from "../utils/multer";

/**
 * Middleware validasi request body menggunakan Zod schema.
 *
 * - Validasi gagal → 400 Bad Request (bukan 500!)
 * - Validasi berhasil → body di-parse ulang (strip unknown fields)
 * - Error non-Zod diteruskan ke ErrorsHandler via next(error)
 */
export const validateRequest =
  (schema: z.ZodTypeAny) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // parseAsync untuk schema async (async refinements)
      // Juga memastikan unknown fields distrip sesuai setting schema
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Bersihkan berkas yang sudah terlanjur diunggah jika validasi payload gagal
        if (req.file) {
          deleteUploadedFile(req.file.path);
        }
        if (Array.isArray(req.files)) {
          req.files.forEach((f) => deleteUploadedFile(f.path));
        } else if (req.files && typeof req.files === "object") {
          Object.values(req.files).forEach((group) => {
            if (Array.isArray(group)) {
              group.forEach((f) => deleteUploadedFile(f.path));
            }
          });
        }

        const errorMessages = error.issues.map((issue) => issue.message);

        // `responses()` sudah memanggil res.json() di dalamnya
        // JANGAN chain .json() lagi — itu yang menyebabkan "Cannot set headers after sent"
        responses(res, 400, "Validasi request gagal", {
          errors: errorMessages,
        });
        return; // Pastikan middleware berhenti di sini
      }

      // Error selain Zod diteruskan ke global error handler
      next(error);
    }
  };
