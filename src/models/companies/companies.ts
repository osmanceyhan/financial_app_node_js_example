// Companies mongo table create schema name,address,phone,website,logo,description,created_at,updated_at
// mongo table create
import mongoose, { Document, Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import {IExpense} from "../expenses/expense";

export interface ICompany extends Document {
    name: string;
    address: string;
    phone: string;
    website: string;
    logo: string;
    description: string;
    status: 'ACTIVE' | 'PASSIVE';
}
const companySchema = new Schema<ICompany>({
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    website: { type: String, required: true },
    logo: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ['ACTIVE', 'PASSIVE'], default: 'ACTIVE' }
}, { timestamps: true });

const expenseInfo ={
    limit : 10,
}
companySchema.plugin(mongoosePaginate);

const Company = mongoose.model<ICompany>('Company', companySchema) as mongoose.PaginateModel<ICompany>;
export default Company;
