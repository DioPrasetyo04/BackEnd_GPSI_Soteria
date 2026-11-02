import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
/**
 * Middleware validasi request body menggunakan Zod schema.
 *
 * - Validasi gagal → 400 Bad Request (bukan 500!)
 * - Validasi berhasil → body di-parse ulang (strip unknown fields)
 * - Error non-Zod diteruskan ke ErrorsHandler via next(error)
 */
export declare const validateRequest: (schema: z.ZodTypeAny) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=ValidateRequest.d.ts.map