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
const expense_1 = __importDefault(require("../models/expenses/expense"));
const expenseType_1 = __importDefault(require("../models/expenses/expenseType"));
const ftpHelper_1 = require("../utils/ftpHelper");
const slugify_1 = __importDefault(require("slugify"));
const date_fns_1 = require("date-fns");
const createExpense = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { date, type, amount, vat, receiptImage } = data;
    if (typeof type !== 'string') {
        throw new Error('Type must be a string');
    }
    let expenseType = yield expenseType_1.default.findOne({ name: type });
    if (!expenseType) {
        const slug = (0, slugify_1.default)(type, { lower: true });
        expenseType = new expenseType_1.default({ name: type, slug });
        yield expenseType.save();
    }
    const formattedDate = (0, date_fns_1.format)(new Date(date), "yyyy-MM-dd");
    const year = (0, date_fns_1.format)(new Date(formattedDate), "yyyy");
    const month = (0, date_fns_1.format)(new Date(formattedDate), "MM");
    const day = (0, date_fns_1.format)(new Date(formattedDate), "dd");
    const remotePath = `/${year}/${month}/${day}`;
    const ftpFilePath = yield (0, ftpHelper_1.uploadToFTP)(receiptImage, remotePath);
    const expense = new expense_1.default({
        date: formattedDate,
        type: expenseType._id,
        amount,
        vat,
        receiptImage: ftpFilePath,
        status: 'ACTIVE',
        accounting_status: 'WAITING'
    });
    return yield expense.save();
});
const deleteExpense = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield expense_1.default.findByIdAndDelete(id);
});
const updateExpense = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const { date, type, amount, vat, receiptImage } = data;
    let expenseType;
    if (type) {
        if (typeof type !== 'string') {
            throw new Error('Type must be a string');
        }
        expenseType = yield expenseType_1.default.findOne({ name: type });
        if (!expenseType) {
            const slug = (0, slugify_1.default)(type, { lower: true });
            expenseType = new expenseType_1.default({ name: type, slug });
            yield expenseType.save();
        }
    }
    let updatedData = Object.assign(Object.assign({}, data), { type: expenseType ? expenseType._id : undefined });
    if (date) {
        const formattedDate = (0, date_fns_1.format)(new Date(date), "yyyy-MM-dd");
        updatedData.date = formattedDate;
    }
    if (receiptImage) {
        const year = (0, date_fns_1.format)(new Date(date), "yyyy");
        const month = (0, date_fns_1.format)(new Date(date), "MM");
        const day = (0, date_fns_1.format)(new Date(date), "dd");
        const remotePath = `/${year}/${month}/${day}`;
        const ftpFilePath = yield (0, ftpHelper_1.uploadToFTP)(receiptImage, remotePath);
        updatedData.receiptImage = ftpFilePath;
    }
    return yield expense_1.default.findByIdAndUpdate(id, updatedData, { new: true });
});
const listExpenses = (year_1, month_1, ...args_1) => __awaiter(void 0, [year_1, month_1, ...args_1], void 0, function* (year, month, page = 1, limit = 10) {
    let query = {};
    if (year) {
        query.date = { $regex: `^${year}` };
        if (month) {
            query.date = { $regex: `^${year}-${month.padStart(2, '0')}` };
        }
    }
    return yield expense_1.default.paginate(query, { page, limit, populate: 'type', sort: { createdAt: -1 } });
});
const getExpenseStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield expense_1.default.aggregate([
        {
            $addFields: {
                date: { $toDate: "$date" }
            }
        },
        {
            $group: {
                _id: { year: { $year: "$date" }, month: { $month: "$date" } },
                totalAmount: { $sum: "$amount" },
                totalVat: { $sum: "$vat" }
            }
        },
        {
            $project: {
                _id: 0,
                year: "$_id.year",
                month: "$_id.month",
                totalAmount: 1,
                totalVat: 1
            }
        },
        {
            $sort: { year: 1, month: 1 }
        }
    ]);
    const stats = {};
    result.forEach((item) => {
        const key = `${item.year}-${String(item.month).padStart(2, '0')}`;
        stats[key] = { totalAmount: item.totalAmount, totalVat: item.totalVat };
    });
    return stats;
});
const listExpenseTypes = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield expenseType_1.default.find();
});
exports.default = {
    createExpense,
    updateExpense,
    listExpenses,
    deleteExpense,
    getExpenseStats,
    listExpenseTypes,
};
