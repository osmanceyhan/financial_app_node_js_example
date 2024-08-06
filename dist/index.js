"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const errorHandler_1 = __importDefault(require("./middleware/errorHandler"));
const routes_1 = __importDefault(require("./utils/routes"));
const database_1 = __importDefault(require("./config/database"));
const expenseRoutes = require('./routes/expense').default;
const authRoutes = require('./routes/auth').default;
const app = (0, express_1.default)();
// Middleware'leri ve diğer yapılandırmaları buraya ekleyin
app.use(express_1.default.json());
// Database
require('./config/database');
(0, database_1.default)();
// Hata yakalama middleware'i
app.use(errorHandler_1.default);
// Route'ları tanımlayın
app.use('/api', routes_1.default);
// Sunucuyu başlatın
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
exports.default = app;
