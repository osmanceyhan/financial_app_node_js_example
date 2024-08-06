"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/auth/user"));
const refreshToken_1 = __importDefault(require("../models/auth/refreshToken"));
const config_1 = require("../config");
const generateAccessToken = (user) => {
    return jsonwebtoken_1.default.sign({ id: user._id, email: user.email }, config_1.JWT_SECRET, { expiresIn: config_1.JWT_EXPIRATION });
};
const generateRefreshToken = (user, ipAddress) => __awaiter(void 0, void 0, void 0, function* () {
    const expires = new Date();
    expires.setDate(expires.getDate() + config_1.REFRESH_TOKEN_EXPIRATION);
    const token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email }, config_1.JWT_REFRESH_SECRET, { expiresIn: `${config_1.REFRESH_TOKEN_EXPIRATION}d` });
    const refreshToken = new refreshToken_1.default({
        user: user._id,
        token,
        expires,
        createdByIp: ipAddress
    });
    yield refreshToken.save();
    return refreshToken;
});
const register = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const userExists = yield user_1.default.findOne({ email: user.email });
    if (userExists) {
        throw new Error('User already exists');
    }
    const hashedPassword = yield bcryptjs_1.default.hash(user.password, 10);
    const newUser = new user_1.default({ email: user.email, password: hashedPassword });
    yield newUser.save();
    return newUser;
});
const login = (email, password, ipAddress) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.default.findOne({ email });
    if (!user || !(yield bcryptjs_1.default.compare(password, user.password))) {
        throw new Error('Email or password is incorrect');
    }
    const accessToken = generateAccessToken(user);
    const refreshToken = yield generateRefreshToken(user, ipAddress);
    return { user, accessToken, refreshToken: refreshToken.token };
});
const findAll = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield user_1.default.find();
});
const findById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield user_1.default.findById(id);
});
const update = (id, user) => __awaiter(void 0, void 0, void 0, function* () {
    return yield user_1.default.findByIdAndUpdate(id, user, { new: true });
});
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield user_1.default.findByIdAndDelete(id);
});
const refreshAccessToken = (token, ipAddress) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = yield refreshToken_1.default.findOne({ token }).populate('user');
    if (!refreshToken || !refreshToken.isActive) {
        throw new Error('Invalid token');
    }
    const user = yield user_1.default.findById(refreshToken.user).exec(); // Tam bir IUser nesnesi elde et
    if (!user) {
        throw new Error('User not found');
    }
    // Yeni access token oluştur
    const accessToken = generateAccessToken(user);
    // Yeni refresh token oluştur ve eski token'ı geçersiz kıl
    const newRefreshToken = yield generateRefreshToken(user, ipAddress);
    refreshToken.revoked = new Date();
    refreshToken.revokedByIp = ipAddress;
    refreshToken.replacedByToken = newRefreshToken.token;
    yield refreshToken.save();
    return { accessToken, refreshToken: newRefreshToken.token };
});
exports.default = {
    register,
    login,
    findAll,
    findById,
    update,
    deleteUser,
    refreshAccessToken
};
