"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globalErrorHandler = (err, req, res, next) => {
    res.status(500).json({
        success: false,
        message: err.message || "Something went wrong!",
        error: err,
    });
};
exports.default = globalErrorHandler;
