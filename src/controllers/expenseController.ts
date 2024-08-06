import { Request, Response } from 'express';
import expenseService from '../services/expenseService';
import { getCdn } from '../utils/cdnHelper';
import { format } from "date-fns";

const createExpense = async (req: Request, res: Response) => {
    try {
        const { date, type, amount, vat } = req.body;
        const receiptImage = req.file?.path || '';
        const expense = await expenseService.createExpense({ date, type, amount, vat, receiptImage });
        res.status(201).json({ message: 'Expense created successfully', expense });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred', error });
    }
};
const updateExpense = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { date, type, amount, vat, receiptImage } = req.body;
        const expense = await expenseService.updateExpense(id, { date, type, amount, vat, receiptImage });
        res.status(200).json({ message: 'Expense updated successfully', expense });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred', error });
    }
};
const deleteExpense = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await expenseService.deleteExpense(id);
        res.status(200).json({ message: 'Expense deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred', error });
    }
}
const listExpenses = async (req: Request, res: Response) => {
    try {
        const { year, month, page = 1, limit = 10 } = req.query;
        const expenses = await expenseService.listExpenses(year as string, month as string, parseInt(page as string), parseInt(limit as string));
        const types = await expenseService.listExpenseTypes();
        const expensesWithFormattedDate = expenses.docs.map((expense: any) => ({
            ...expense.toObject(),
            date: format(new Date(expense.date), "yyyy-MM-dd"),
            receiptImage: getCdn(expense.receiptImage)
        }));
        const stats = await expenseService.getExpenseStats();

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
    } catch (error) {
        res.status(500).json({ message: 'An error occurred', error });
    }
};

export default {
    createExpense,
    updateExpense,
    deleteExpense,
    listExpenses,
};
