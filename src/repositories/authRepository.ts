import User, { IUser } from '../models/auth/user';
import { RegisterRequest } from "../types/auth";

class AuthRepository {

    // Object literal may only specify known properties, and 'email' does not exist in type 'Partial<RegisterRequest>'
    // Property 'email' does not exist on type 'Partial<RegisterRequest>'
    async store(user: Partial<{ email: string; password: string }>): Promise<IUser> {
        let lastUser = await User.findOne().sort({ createdAt: -1 });
        const newUser = { ...user, id: lastUser ? lastUser.id + 1 : 1 };
        return User.create(newUser);
    }

    async findAll(): Promise<IUser[]> {
        return User.find();
    }

    async findUserByEmail(email: string): Promise<IUser | null> {
        return User.findOne({ email });
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
