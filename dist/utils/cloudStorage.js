"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToStorage = uploadToStorage;
exports.deleteFromStorage = deleteFromStorage;
const supabase_js_1 = require("@supabase/supabase-js");
const node_path_1 = __importDefault(require("node:path"));
const node_fs_1 = __importDefault(require("node:fs"));
const supabaseUrl = process.env.SUPABASE_URL || "https://deflctbvcxzjckardphn.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_KEY ||
    process.env.SUPABASE_ANON_KEY;
const isServerless = process.env.VERCEL === "1" ||
    Boolean(process.env.VERCEL_ENV) ||
    Boolean(process.env.NOW_REGION) ||
    Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME) ||
    Boolean(process.env.LAMBDA_TASK_ROOT);
/**
 * Upload buffer file ke Supabase Storage (atau fallback lokal / data URI).
 */
async function uploadToStorage(file, options) {
    const ext = node_path_1.default.extname(file.originalname).toLowerCase() ||
        `.${file.mimetype.split("/")[1] || "bin"}`;
    const baseName = node_path_1.default
        .basename(file.originalname, ext)
        .replace(/[^a-zA-Z0-9_-]/g, "_");
    const dateStr = new Date().toISOString().split("T")[0];
    const uniqueSuffix = `${dateStr}-${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    const fileName = `${uniqueSuffix}-${baseName}${ext}`;
    // 1. Prioritas Utama: Upload ke Supabase Storage jika credentials tersedia
    if (supabaseKey) {
        try {
            const supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey, {
                auth: { persistSession: false },
            });
            const { data, error } = await supabase.storage
                .from(options.bucket)
                .upload(fileName, file.buffer, {
                contentType: file.mimetype,
                upsert: true,
            });
            if (!error && data) {
                const { data: publicData } = supabase.storage
                    .from(options.bucket)
                    .getPublicUrl(fileName);
                if (publicData?.publicUrl) {
                    return publicData.publicUrl;
                }
            }
            else if (error) {
                console.error("Supabase Storage upload error:", error);
            }
        }
        catch (err) {
            console.error("Supabase Storage upload exception:", err);
        }
    }
    // 2. Lingkungan Lokal (non-serverless): Tulis langsung ke public storage
    if (!isServerless) {
        try {
            const folder = options.folder || (options.bucket === "warta" ? "files" : "images");
            const targetDir = node_path_1.default.join(process.cwd(), "public", folder);
            if (!node_fs_1.default.existsSync(targetDir)) {
                node_fs_1.default.mkdirSync(targetDir, { recursive: true });
            }
            const filePath = node_path_1.default.join(targetDir, fileName);
            node_fs_1.default.writeFileSync(filePath, file.buffer);
            return `/public/${folder}/${fileName}`;
        }
        catch (err) {
            console.warn("Failed to write to local storage, falling back:", err);
        }
    }
    // 3. Fallback Serverless tanpa Supabase key: Encode sebagai Data URI
    // Memastikan upload di serverless (Vercel) tidak pernah melempar HTTP 500 EROFS
    return `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
}
/**
 * Hapus berkas dari Supabase Storage atau local disk storage.
 */
async function deleteFromStorage(fileUrl, bucket) {
    if (!fileUrl || typeof fileUrl !== "string")
        return;
    // Supabase Storage
    if (fileUrl.includes("supabase.co") && supabaseKey) {
        try {
            const parts = fileUrl.split(`/${bucket}/`);
            if (parts[1]) {
                const filePath = decodeURIComponent(parts[1]);
                const supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey, {
                    auth: { persistSession: false },
                });
                await supabase.storage.from(bucket).remove([filePath]);
            }
        }
        catch (err) {
            console.error("Failed to delete from Supabase storage:", err);
        }
        return;
    }
    // Local storage
    if (fileUrl.startsWith("/public/")) {
        try {
            const cleanPath = fileUrl.replace(/^[/\\]+/, "");
            const fullPath = node_path_1.default.resolve(process.cwd(), cleanPath);
            if (node_fs_1.default.existsSync(fullPath)) {
                node_fs_1.default.unlinkSync(fullPath);
            }
        }
        catch (err) {
            console.error("Failed to delete local file:", err);
        }
    }
}
//# sourceMappingURL=cloudStorage.js.map