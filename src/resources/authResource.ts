import { IUser } from '../models/auth/user';

class authResource {
    transform(user: IUser): {
        id: number;
        _id: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
    } {
        return {
            id: user.id,
            _id: user._id,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };
    }

    collection(users: IUser[]): { id: number; _id: string; email: string; createdAt: Date; updatedAt: Date }[] {
        return users.map(user => this.transform(user));
    }
}

export default new authResource();
