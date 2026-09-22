import type { Request, Response, NextFunction } from "express";
import ClientError from "../exceptions/clientError";
import responses from "../utils/response";

/**
 * Global error handler middleware.
 *
 * Harus memiliki 4 parameter (err, req, res, next) agar Express
 * mengenalinya sebagai error-handling middleware.
 *
 * Harus didaftarkan TERAKHIR di app.ts, setelah semua routes.
 *
 * Alur error:
 *   Service melempar InvariantError/NotFoundError (turunan ClientError)
 *   → Controller menangkap dan memanggil next(error)
 *   → ErrorsHandler menangkap dan mengirim response yang sesuai
 */

/** Tipe khusus untuk SyntaxError yang dilempar oleh body-parser */
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
  // Terjadi ketika request body bukan JSON valid.
  // Contoh: single quotes, key tanpa tanda kutip, trailing comma, dll.
  if (isBodyParserError(err)) {
    responses(res, 400, "Format JSON tidak valid pada request body", {
      hint: "Pastikan Content-Type: application/json dan body menggunakan double-quote (\").",
      detail: err.message,
    });
    return;
  }

  // ── 2. Domain errors (ClientError dan turunannya) ────────────────────────
  // InvariantError (400), NotFoundError (404),
  // AuthenticationError (401), AuthorizationError (403)
  if (err instanceof ClientError) {
    responses(res, err.statusCode, err.message, null);
    return;
  }

  // ── 3. Unhandled / unexpected errors → 500 ──────────────────────────────
  // Di production jangan ekspos detail error internal ke client.
  const isDev = process.env.NODE_ENV === "development";
  responses(
    res,
    500,
    "Internal Server Error",
    isDev ? { detail: err.message } : null,
  );
};

export default ErrorsHandler;
