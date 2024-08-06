import Expense, { IExpense } from '../models/expenses/expense';

const createExpense = async (data: Partial<IExpense>): Promise<IExpense> => {
    const expense = new Expense(data);
    return await expense.save();
};

const listExpenses = async (): Promise<IExpense[]> => {
    return await Expense.find();
};

export default {
    createExpense,
    listExpenses,
};
