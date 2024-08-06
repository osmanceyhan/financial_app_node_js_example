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
const companies_1 = __importDefault(require("../../models/companies/companies"));
const createCompany = (company) => __awaiter(void 0, void 0, void 0, function* () {
    return yield companies_1.default.create(company);
});
const updateCompany = (id, company) => __awaiter(void 0, void 0, void 0, function* () {
    return yield companies_1.default.findByIdAndUpdate(id, company, { new: true });
});
const deleteCompany = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield companies_1.default.findByIdAndDelete(id);
});
const listCompanies = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield companies_1.default.find();
});
exports.default = {
    createCompany,
    updateCompany,
    deleteCompany,
    listCompanies,
};
