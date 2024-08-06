"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const router = (0, express_1.Router)();
const routesPath = path_1.default.join(__dirname, '../routes');
fs_1.default.readdirSync(routesPath).forEach((folder) => {
    const folderPath = path_1.default.join(routesPath, folder);
    // Eğer bu bir klasörse
    if (fs_1.default.lstatSync(folderPath).isDirectory()) {
        // Klasörün içindeki index.js dosyasını yükle
        const routePath = path_1.default.join(folderPath, 'index.js');
        if (fs_1.default.existsSync(routePath)) {
            const route = require(routePath).default;
            console.log(`/${folder}`);
            router.use(`/${folder}`, route);
        }
    }
});
exports.default = router;
