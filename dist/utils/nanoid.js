"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.nanoid = void 0;
const node_crypto_1 = __importDefault(require("node:crypto"));
/**
 * Pengganti native nanoid menggunakan node:crypto bawaan.
 * Menghasilkan string acak URL-safe (A-Za-z0-9_-) yang 100% kompatibel
 * dengan CommonJS dan ES Modules tanpa external dependency ESM.
 */
const nanoid = (size = 21) => {
    return node_crypto_1.default
        .randomBytes(Math.ceil(size * 0.75))
        .toString("base64url")
        .slice(0, size);
};
exports.nanoid = nanoid;
exports.default = exports.nanoid;
//# sourceMappingURL=nanoid.js.map