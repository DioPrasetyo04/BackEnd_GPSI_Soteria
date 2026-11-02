"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const DashboardController_1 = require("../controllers/DashboardController");
const dashboardRoutes = express_1.default.Router();
dashboardRoutes.get("/stats", DashboardController_1.getDashboardStats);
dashboardRoutes.get("/", DashboardController_1.getDashboardStats);
exports.default = dashboardRoutes;
//# sourceMappingURL=DashboardRoutes.js.map