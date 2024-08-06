"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT_REFRESH_SECRET = exports.REFRESH_TOKEN_EXPIRATION = exports.JWT_EXPIRATION = exports.JWT_SECRET = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.JWT_SECRET = process.env.JWT_SECRET || 'secret';
exports.JWT_EXPIRATION = '1h'; // Token süresi (1 saat)
exports.REFRESH_TOKEN_EXPIRATION = 7; // Refresh token süresi (7 gün)
exports.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh_secret';
