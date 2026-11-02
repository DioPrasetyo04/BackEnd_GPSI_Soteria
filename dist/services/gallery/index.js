"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const GalleryRoutes_1 = __importDefault(require("./routes/GalleryRoutes"));
const indexGalleryRoutes = express_1.default.Router();
indexGalleryRoutes.use(GalleryRoutes_1.default);
exports.default = indexGalleryRoutes;
//# sourceMappingURL=index.js.map