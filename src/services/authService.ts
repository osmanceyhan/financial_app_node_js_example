import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/auth/user';
import RefreshToken, { IRefreshToken } from '../models/auth/refreshToken';
import { RegisterRequest } from "../types/auth";
import { JWT_SECRET, JWT_EXPIRATION, REFRESH_TOKEN_EXPIRATION, JWT_REFRESH_SECRET } from '../config';

const generateAccessToken = (user: IUser) => {
    return jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
};

const generateRefreshToken = async (user: IUser, ipAddress: string) => {
    const expires = new Date();
    expires.setDate(expires.getDate() + REFRESH_TOKEN_EXPIRATION);
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_REFRESH_SECRET, { expiresIn: `${REFRESH_TOKEN_EXPIRATION}d` });

    const refreshToken = new RefreshToken({
        user: user._id,
        token,
        expires,
        createdByIp: ipAddress
    });
    await refreshToken.save();
    return refreshToken;
};

const register = async (user: RegisterRequest['body']): Promise<IUser> => {

    const userExists = await User.findOne({ email: user.email });
    if (userExists) {
        throw new Error('User already exists');
    }
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = new User({ email: user.email, password: hashedPassword });
    await newUser.save();
    return newUser;
};

const login = async (email: string, password: string, ipAddress: string) => {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error('Email or password is incorrect');
    }
    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user, ipAddress);
    return { user, accessToken, refreshToken: refreshToken.token };
};



const findAll = async (): Promise<IUser[]> => {
    return await User.find();
};

const findById = async (id: string): Promise<IUser | null> => {
    return await User.findById(id);
};

const update = async (id: string, user: Partial<IUser>): Promise<IUser | null> => {
    return await User.findByIdAndUpdate(id, user, { new: true });
};

const deleteUser = async (id: string): Promise<IUser | null> => {
    return await User.findByIdAndDelete(id);
};

const refreshAccessToken = async (token: string, ipAddress: string)  => {
    const refreshToken = await RefreshToken.findOne({ token }).populate('user');
    if (!refreshToken || !refreshToken.isActive) {
        throw new Error('Invalid token');
    }

    const user = await User.findById(refreshToken.user).exec(); // Tam bir IUser nesnesi elde et
    if (!user) {
        throw new Error('User not found');
    }

    // Yeni access token oluştur
    const accessToken = generateAccessToken(user);

    // Yeni refresh token oluştur ve eski token'ı geçersiz kıl
    const newRefreshToken = await generateRefreshToken(user, ipAddress);
    refreshToken.revoked = new Date();
    refreshToken.revokedByIp = ipAddress;
    refreshToken.replacedByToken = newRefreshToken.token;
    await refreshToken.save();

    return { accessToken, refreshToken: newRefreshToken.token };
};


export default {
    register,
    login,
    findAll,
    findById,
    update,
    deleteUser,
    refreshAccessToken
};
