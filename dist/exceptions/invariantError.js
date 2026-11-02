"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const clientError_1 = __importDefault(require("./clientError"));
class InvariantError extends clientError_1.default {
    constructor(message) {
        super(message, 400);
        this.name = "Invariant Error";
    }
}
exports.default = InvariantError;
//# sourceMappingURL=invariantError.js.map