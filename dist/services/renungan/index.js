"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const RenunganRoutes_1 = __importDefault(require("./routes/RenunganRoutes"));
const indexRenunganRoutes = express_1.default.Router();
indexRenunganRoutes.use(RenunganRoutes_1.default);
exports.default = indexRenunganRoutes;
//# sourceMappingURL=index.js.map