"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const clientError_1 = __importDefault(require("./clientError"));
class AuthorizationError extends clientError_1.default {
    constructor(message) {
        super(message, 403);
        this.name = "Authorization Error";
    }
}
exports.default = AuthorizationError;
//# sourceMappingURL=authorizationError.js.map