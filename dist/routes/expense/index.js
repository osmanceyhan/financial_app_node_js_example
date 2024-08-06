"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const expenseController_1 = __importDefault(require("../../controllers/expenseController"));
const multer_1 = __importDefault(require("../../utils/multer"));
const authMiddleware_1 = require("../../middleware/authMiddleware");
const router = express_1.default.Router();
// verifyToken middleware'i ile oturum doğrulaması yapılmış kullanıcıları koruma
router.post('/', authMiddleware_1.verifyToken, multer_1.default.single('receiptImage'), expenseController_1.default.createExpense);
router.get('/', authMiddleware_1.verifyToken, expenseController_1.default.listExpenses);
router.put('/:id', authMiddleware_1.verifyToken, multer_1.default.single('receiptImage'), expenseController_1.default.updateExpense);
router.delete('/:id', authMiddleware_1.verifyToken, multer_1.default.single('receiptImage'), expenseController_1.default.deleteExpense);
exports.default = router;
