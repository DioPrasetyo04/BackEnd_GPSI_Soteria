import type { Request, Response, NextFunction } from "express";
import multer from "multer";
import ClientError from "../exceptions/clientError";
import responses from "../utils/response";

/**
 * Global error handler middleware.
 */
interface BodyParserSyntaxError extends SyntaxError {
  status: number;
  body: unknown;
}

const isBodyParserError = (err: Error): err is BodyParserSyntaxError =>
  err instanceof SyntaxError &&
  "status" in err &&
  (err as BodyParserSyntaxError).status === 400;

const ErrorsHandler = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
): void => {
  // ── 1. Body-parser JSON syntax error ────────────────────────────────────
  if (isBodyParserError(err)) {
    responses(res, 400, "Format JSON tidak valid pada request body", {
      hint: "Pastikan Content-Type: application/json dan body menggunakan double-quote (\").",
      detail: err.message,
    });
    return;
  }

  // ── 2. Multer upload errors (File size limit, field mismatch, etc.) ──────
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      responses(
        res,
        413,
        "Ukuran file melebihi batas maksimal yang diizinkan (Dokumen maks 4 MB, Gambar maks 3 MB)",
        {
          code: err.code,
          field: err.field,
        },
      );
      return;
    }

    responses(res, 400, `Kesalahan saat mengunggah file: ${err.message}`, {
      code: err.code,
      field: err.field,
    });
    return;
  }

  // ── 3. Domain errors (ClientError dan turunannya) ────────────────────────
  if (err instanceof ClientError) {
    responses(res, err.statusCode, err.message, null);
    return;
  }

  // ── 4. Unhandled / unexpected errors → 500 ──────────────────────────────
  console.error("Unhandled error caught in ErrorsHandler:", err);
  const isDev = process.env.NODE_ENV === "development";
  responses(
    res,
    500,
    "Internal Server Error",
    isDev ? { detail: err.message, stack: err.stack } : { message: err.message },
  );
};

export default ErrorsHandler;
