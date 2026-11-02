"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const responses = (res, statusCode, message, data) => {
    let status;
    if (statusCode >= 200 && statusCode < 300) {
        status = "success response";
    }
    else if (statusCode >= 400 && statusCode < 500) {
        status = "error response";
    }
    else {
        status = "failed response";
    }
    const body = {
        status: status,
        message: message,
        data: data,
    };
    if (data !== undefined && data !== null) {
        body.data = data;
    }
    return res.status(statusCode).json(body);
};
exports.default = responses;
//# sourceMappingURL=response.js.map