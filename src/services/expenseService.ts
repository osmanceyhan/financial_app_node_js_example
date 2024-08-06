import Expense, { IExpense } from '../models/expenses/expense';
import ExpenseType, { IExpenseType } from '../models/expenses/expenseType';
import { uploadToFTP } from '../utils/ftpHelper';
import slugify from 'slugify';
import { format } from "date-fns";

const createExpense = async (data: Partial<IExpense>) => {
    const { date, type, amount, vat, receiptImage } = data;

    if (typeof type !== 'string') {
        throw new Error('Type must be a string');
    }

    let expenseType = await ExpenseType.findOne({ name: type });
    if (!expenseType) {
        const slug = slugify(type, { lower: true });
        expenseType = new ExpenseType({ name: type, slug });
        await expenseType.save();
    }

    const formattedDate = format(new Date(date!), "yyyy-MM-dd");

    const year = format(new Date(formattedDate), "yyyy");
    const month = format(new Date(formattedDate), "MM");
    const day = format(new Date(formattedDate), "dd");

    const remotePath = `/${year}/${month}/${day}`;
    const ftpFilePath = await uploadToFTP(receiptImage!, remotePath);

    const expense = new Expense({
        date: formattedDate,
        type: expenseType._id,
        amount,
        vat,
        receiptImage: ftpFilePath,
        status: 'ACTIVE',
        accounting_status: 'WAITING'
    });
    return await expense.save();
};

const deleteExpense = async (id: string) => {
    return await Expense.findByIdAndDelete(id);
}
const updateExpense = async (id: string, data: Partial<IExpense>) => {
    const { date, type, amount, vat, receiptImage } = data;

    let expenseType;
    if (type) {
        if (typeof type !== 'string') {
            throw new Error('Type must be a string');
        }

        expenseType = await ExpenseType.findOne({ name: type });
        if (!expenseType) {
            const slug = slugify(type, { lower: true });
            expenseType = new ExpenseType({ name: type, slug });
            await expenseType.save();
        }
    }

    let updatedData: Partial<IExpense> = {
        ...data,
        type: expenseType ? expenseType._id : undefined,
    };

    if (date) {
        const formattedDate = format(new Date(date), "yyyy-MM-dd");
        updatedData.date = formattedDate;
    }

    if (receiptImage) {
        const year = format(new Date(date!), "yyyy");
        const month = format(new Date(date!), "MM");
        const day = format(new Date(date!), "dd");

        const remotePath = `/${year}/${month}/${day}`;
        const ftpFilePath = await uploadToFTP(receiptImage, remotePath);
        updatedData.receiptImage = ftpFilePath;
    }

    return await Expense.findByIdAndUpdate(id, updatedData, { new: true });
};

const listExpenses = async (year?: string, month?: string, page: number = 1, limit: number = 10) => {
    let query: any = {};
    if (year) {
        query.date = { $regex: `^${year}` };
        if (month) {
            query.date = { $regex: `^${year}-${month.padStart(2, '0')}` };
        }
    }
    return await Expense.paginate(query, { page, limit, populate: 'type',sort:{createdAt:-1} });
};

interface ExpenseStats {
    [key: string]: { totalAmount: number; totalVat: number };
}

const getExpenseStats = async () => {
    const result = await Expense.aggregate([
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

    const stats: ExpenseStats = {};
    result.forEach((item) => {
        const key = `${item.year}-${String(item.month).padStart(2, '0')}`;
        stats[key] = { totalAmount: item.totalAmount, totalVat: item.totalVat };
    });

    return stats;
};


const listExpenseTypes = async () => {
    return await ExpenseType.find();
};

export default {
    createExpense,
    updateExpense,
    listExpenses,
    deleteExpense,
    getExpenseStats,
    listExpenseTypes,
};
