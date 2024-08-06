"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationHandler = exports.loginValidator = exports.registerValidator = void 0;
const express_validator_1 = require("express-validator");
exports.registerValidator = [
    (0, express_validator_1.check)('email').isEmail().withMessage('Enter a valid email'),
    (0, express_validator_1.check)('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];
exports.loginValidator = [
    (0, express_validator_1.check)('email').isEmail().withMessage('Enter a valid email'),
    (0, express_validator_1.check)('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];
const validationHandler = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};
exports.validationHandler = validationHandler;
