"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const WartaRoutes_1 = __importDefault(require("./routes/WartaRoutes"));
const indexWartaRoutes = express_1.default.Router();
indexWartaRoutes.use(WartaRoutes_1.default);
exports.default = indexWartaRoutes;
//# sourceMappingURL=index.js.map