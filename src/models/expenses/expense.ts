import mongoose, { Document, Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { IExpenseType } from './expenseType';

export interface IExpense extends Document {
    date: string;
    type: IExpenseType['_id'];
    amount: number;
    vat: number;
    receiptImage: string;
    status: 'ACTIVE' | 'PASSIVE';
    accounting_status: 'APPROVED' | 'REJECTED' | 'WAITING';
}

const expenseSchema = new Schema<IExpense>({
    date: { type: String, required: true },
    type: { type: Schema.Types.ObjectId, ref: 'ExpenseType', required: true },
    amount: { type: Number, required: true },
    vat: { type: Number, required: true },
    receiptImage: { type: String },
    status: { type: String, enum: ['ACTIVE', 'PASSIVE'], default: 'ACTIVE' },
    accounting_status: { type: String, enum: ['APPROVED', 'REJECTED', 'WAITING'], default: 'WAITING' }
}, { timestamps: true });

const expenseInfo ={
    limit : 10,
}
expenseSchema.plugin(mongoosePaginate);

const Expense = mongoose.model<IExpense>('Expense', expenseSchema) as mongoose.PaginateModel<IExpense>;
export default Expense;
