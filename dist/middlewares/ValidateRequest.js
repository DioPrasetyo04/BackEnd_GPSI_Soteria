"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const zod_1 = require("zod");
const response_1 = __importDefault(require("../utils/response"));
const multer_1 = require("../utils/multer");
/**
 * Middleware validasi request body menggunakan Zod schema.
 *
 * - Validasi gagal → 400 Bad Request (bukan 500!)
 * - Validasi berhasil → body di-parse ulang (strip unknown fields)
 * - Error non-Zod diteruskan ke ErrorsHandler via next(error)
 */
const validateRequest = (schema) => async (req, res, next) => {
    try {
        // parseAsync untuk schema async (async refinements)
        // Juga memastikan unknown fields distrip sesuai setting schema
        req.body = await schema.parseAsync(req.body);
        next();
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            // Bersihkan berkas yang sudah terlanjur diunggah jika validasi payload gagal
            if (req.file) {
                (0, multer_1.deleteUploadedFile)(req.file.path);
            }
            if (Array.isArray(req.files)) {
                req.files.forEach((f) => (0, multer_1.deleteUploadedFile)(f.path));
            }
            else if (req.files && typeof req.files === "object") {
                Object.values(req.files).forEach((group) => {
                    if (Array.isArray(group)) {
                        group.forEach((f) => (0, multer_1.deleteUploadedFile)(f.path));
                    }
                });
            }
            const errorMessages = error.issues.map((issue) => issue.message);
            // `responses()` sudah memanggil res.json() di dalamnya
            // JANGAN chain .json() lagi — itu yang menyebabkan "Cannot set headers after sent"
            (0, response_1.default)(res, 400, "Validasi request gagal", {
                errors: errorMessages,
            });
            return; // Pastikan middleware berhenti di sini
        }
        // Error selain Zod diteruskan ke global error handler
        next(error);
    }
};
exports.validateRequest = validateRequest;
//# sourceMappingURL=ValidateRequest.js.map