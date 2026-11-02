"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ClientError extends Error {
    statusCode;
    constructor(message, statusCode = 400) {
        super(message);
        this.statusCode = statusCode;
        this.name = "Client Error";
        this.statusCode = statusCode;
    }
}
exports.default = ClientError;
//# sourceMappingURL=clientError.js.map