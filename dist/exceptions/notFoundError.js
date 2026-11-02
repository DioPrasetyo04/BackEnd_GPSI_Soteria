"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const clientError_1 = __importDefault(require("./clientError"));
class NotFoundError extends clientError_1.default {
    constructor(message) {
        super(message, 404);
        this.name = "Not Found Error";
    }
}
exports.default = NotFoundError;
//# sourceMappingURL=notFoundError.js.map