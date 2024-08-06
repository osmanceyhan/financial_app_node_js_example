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
const user_1 = __importDefault(require("../models/auth/user"));
class AuthRepository {
    // Object literal may only specify known properties, and 'email' does not exist in type 'Partial<RegisterRequest>'
    // Property 'email' does not exist on type 'Partial<RegisterRequest>'
    store(user) {
        return __awaiter(this, void 0, void 0, function* () {
            let lastUser = yield user_1.default.findOne().sort({ createdAt: -1 });
            const newUser = Object.assign(Object.assign({}, user), { id: lastUser ? lastUser.id + 1 : 1 });
            return user_1.default.create(newUser);
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return user_1.default.find();
        });
    }
    findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return user_1.default.findOne({ email });
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return user_1.default.findById(id);
        });
    }
    update(id, user) {
        return __awaiter(this, void 0, void 0, function* () {
            return user_1.default.findByIdAndUpdate(id, user, { new: true });
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return user_1.default.findByIdAndDelete(id);
        });
    }
}
exports.default = new AuthRepository();
