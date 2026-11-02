"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("./authentication/index"));
const index_2 = __importDefault(require("./jadwal/index"));
const index_3 = __importDefault(require("./renungan/index"));
const index_4 = __importDefault(require("./warta/index"));
const index_5 = __importDefault(require("./user/index"));
const index_6 = __importDefault(require("./organization/index"));
const index_7 = __importDefault(require("./gallery/index"));
const index_8 = __importDefault(require("./dashboard/index"));
const allRoutes = express_1.default.Router();
allRoutes.use("/auth", index_1.default);
allRoutes.use("/dashboard", index_8.default);
allRoutes.use("/jadwal", index_2.default);
allRoutes.use("/renungan", index_3.default);
allRoutes.use("/warta", index_4.default);
allRoutes.use("/users", index_5.default);
allRoutes.use("/organization", index_6.default);
allRoutes.use("/gallery", index_7.default);
allRoutes.use("/galeri", index_7.default);
exports.default = allRoutes;
//# sourceMappingURL=index.js.map