"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const JadwalRoutes_1 = __importDefault(require("./routes/JadwalRoutes"));
const indexJadwalRoutes = express_1.default.Router();
indexJadwalRoutes.use(JadwalRoutes_1.default);
exports.default = indexJadwalRoutes;
//# sourceMappingURL=index.js.map