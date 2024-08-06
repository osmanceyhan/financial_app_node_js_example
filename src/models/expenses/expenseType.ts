import mongoose, { Document, Schema } from 'mongoose';

export interface IExpenseType extends Document {
    name: string;
    slug: string;
}

const expenseTypeSchema = new Schema<IExpenseType>({
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true }
}, { timestamps: true });

const ExpenseType = mongoose.model<IExpenseType>('ExpenseType', expenseTypeSchema);
export default ExpenseType;
