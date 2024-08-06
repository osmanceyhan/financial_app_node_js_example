"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCdn = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const CDN_URL = process.env.CDN_URL;
const getCdn = (filePath) => {
    return `${CDN_URL}${filePath}`;
};
exports.getCdn = getCdn;
