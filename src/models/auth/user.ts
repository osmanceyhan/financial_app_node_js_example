import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    _id: string;
    id: number;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema: Schema = new Schema({
    id: { type: Number, required: false, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
}, { timestamps: true });

export interface IUserModel{
    id: number;
    email: string;
    password: string;
}

export default mongoose.model<IUser>('User', userSchema);
