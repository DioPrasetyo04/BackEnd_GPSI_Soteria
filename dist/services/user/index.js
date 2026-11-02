"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UserRoutes_1 = __importDefault(require("./routes/UserRoutes"));
const VerifyToken_1 = require("../../middlewares/VerifyToken");
const indexUserRoutes = express_1.default.Router();
// Autentikasi token pengguna
indexUserRoutes.use(VerifyToken_1.verifyToken);
// Multi-enable authorization: Lolos jika memiliki salah satu role (ADMIN, SUPER_ADMIN)
// atau memiliki permission 'users.view' / 'users.manage'
indexUserRoutes.use((0, VerifyToken_1.verifyRoleOrPermission)({
    roles: ["ADMIN", "SUPER_ADMIN"],
    permissions: ["users.view", "users.manage"],
}));
indexUserRoutes.use(UserRoutes_1.default);
exports.default = indexUserRoutes;
//# sourceMappingURL=index.js.map