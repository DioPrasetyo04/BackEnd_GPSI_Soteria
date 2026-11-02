"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const clientError_1 = __importDefault(require("../exceptions/clientError"));
const response_1 = __importDefault(require("../utils/response"));
const isBodyParserError = (err) => err instanceof SyntaxError &&
    "status" in err &&
    err.status === 400;
const ErrorsHandler = (err, req, res, 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
next) => {
    // ── 1. Body-parser JSON syntax error ────────────────────────────────────
    if (isBodyParserError(err)) {
        (0, response_1.default)(res, 400, "Format JSON tidak valid pada request body", {
            hint: "Pastikan Content-Type: application/json dan body menggunakan double-quote (\").",
            detail: err.message,
        });
        return;
    }
    // ── 2. Multer upload errors (File size limit, field mismatch, etc.) ──────
    if (err instanceof multer_1.default.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
            (0, response_1.default)(res, 413, "Ukuran file melebihi batas maksimal yang diizinkan (Dokumen maks 4 MB, Gambar maks 3 MB)", {
                code: err.code,
                field: err.field,
            });
            return;
        }
        (0, response_1.default)(res, 400, `Kesalahan saat mengunggah file: ${err.message}`, {
            code: err.code,
            field: err.field,
        });
        return;
    }
    // ── 3. Domain errors (ClientError dan turunannya) ────────────────────────
    if (err instanceof clientError_1.default) {
        (0, response_1.default)(res, err.statusCode, err.message, null);
        return;
    }
    // ── 4. Unhandled / unexpected errors → 500 ──────────────────────────────
    console.error("Unhandled error caught in ErrorsHandler:", err);
    const isDev = process.env.NODE_ENV === "development";
    (0, response_1.default)(res, 500, "Internal Server Error", isDev ? { detail: err.message, stack: err.stack } : { message: err.message });
};
exports.default = ErrorsHandler;
//# sourceMappingURL=Errors.js.map