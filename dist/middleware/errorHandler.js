"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const errorHandler = (err, req, res, next) => {
    if (err instanceof mongodb_1.MongoServerError && err.code === 11000) {
        // Duplicate key error
        return res.status(400).json({
            success: false,
            message: 'Duplicate key error: An account with this email already exists.'
        });
    }
    res.status(500).json({
        success: false,
        message: err.message || 'Something went wrong'
    });
};
exports.default = errorHandler;
