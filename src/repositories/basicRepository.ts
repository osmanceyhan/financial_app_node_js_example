import User, { IUser } from '../models/auth/user';
import {RegisterRequest} from "../types/auth";

class AuthRepository {
    async store(user: Partial<RegisterRequest>): Promise<IUser> {
        let lastId = await User.findOne().sort({ createdAt: -1 });
        lastId = lastId?.id + 1;
        return User.create({ ...user, id: lastId });
    }

    async findAll(): Promise<IUser[]> {
        return User.find();
    }

    // login
    async login(user: Partial<IUser>): Promise<IUser | null> {
        return User.findOne({ email: user.email, password: user.password });
    }

    async findById(id: string): Promise<IUser | null> {
        return User.findById(id);
    }

    async update(id: string, user: Partial<IUser>): Promise<IUser | null> {
        return User.findByIdAndUpdate(id, user, { new: true });
    }

    async delete(id: string): Promise<IUser | null> {
        return User.findByIdAndDelete(id);
    }
}

export default new AuthRepository();
