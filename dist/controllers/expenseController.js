"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const expenseService_1 = __importDefault(require("../services/expenseService"));
const cdnHelper_1 = require("../utils/cdnHelper");
const date_fns_1 = require("date-fns");
const createExpense = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { date, type, amount, vat } = req.body;
        const receiptImage = ((_a = req.file) === null || _a === void 0 ? void 0 : _a.path) || '';
        const expense = yield expenseService_1.default.createExpense({ date, type, amount, vat, receiptImage });
        res.status(201).json({ message: 'Expense created successfully', expense });
    }
    catch (error) {
        res.status(500).json({ message: 'An error occurred', error });
    }
});
const updateExpense = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { date, type, amount, vat, receiptImage } = req.body;
        const expense = yield expenseService_1.default.updateExpense(id, { date, type, amount, vat, receiptImage });
        res.status(200).json({ message: 'Expense updated successfully', expense });
    }
    catch (error) {
        res.status(500).json({ message: 'An error occurred', error });
    }
});
const deleteExpense = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield expenseService_1.default.deleteExpense(id);
        res.status(200).json({ message: 'Expense deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'An error occurred', error });
    }
});
const listExpenses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { year, month, page = 1, limit = 10 } = req.query;
        const expenses = yield expenseService_1.default.listExpenses(year, month, parseInt(page), parseInt(limit));
        const types = yield expenseService_1.default.listExpenseTypes();
        const expensesWithFormattedDate = expenses.docs.map((expense) => (Object.assign(Object.assign({}, expense.toObject()), { date: (0, date_fns_1.format)(new Date(expense.date), "yyyy-MM-dd"), receiptImage: (0, cdnHelper_1.getCdn)(expense.receiptImage) })));
        const stats = yield expenseService_1.default.getExpenseStats();
        res.status(200).json({
            data: expensesWithFormattedDate,
            message: 'Expenses listed successfully',
            success: true,
            info: { types,
                totalDocs: expenses.totalDocs,
                totalPages: expenses.totalPages,
                stats,
                page: expenses.page,
                limit: expenses.limit
            }
        });
    }
    catch (error) {
        res.status(500).json({ message: 'An error occurred', error });
    }
});
exports.default = {
    createExpense,
    updateExpense,
    deleteExpense,
    listExpenses,
};
