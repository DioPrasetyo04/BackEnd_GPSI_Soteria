"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const clientError_1 = __importDefault(require("./clientError"));
class AuthenticationError extends clientError_1.default {
    constructor(message) {
        super(message, 401);
        this.name = "Authentication Error";
    }
}
exports.default = AuthenticationError;
//# sourceMappingURL=authenticationError.js.map