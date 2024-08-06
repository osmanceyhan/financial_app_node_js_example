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
const companyService_1 = __importDefault(require("../../services/companies/companyService"));
const createCompany = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const company = req.body;
        const newCompany = yield companyService_1.default.createCompany(company);
        res.status(201).json({ message: 'Company created successfully', company: newCompany });
    }
    catch (error) {
        res.status(500).json({ message: 'An error occurred', error });
    }
});
const updateCompany = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const company = req.body;
        const updatedCompany = yield companyService_1.default.updateCompany(id, company);
        res.status(200).json({ message: 'Company updated successfully', company: updatedCompany });
    }
    catch (error) {
        res.status(500).json({ message: 'An error occurred', error });
    }
});
const deleteCompany = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield companyService_1.default.deleteCompany(id);
        res.status(200).json({ message: 'Company deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'An error occurred', error });
    }
});
const listCompanies = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const companies = yield companyService_1.default.listCompanies();
        res.status(200).json({ message: 'Companies listed successfully', companies });
    }
    catch (error) {
        res.status(500).json({ message: 'An error occurred', error });
    }
});
exports.default = {
    createCompany,
    updateCompany,
    deleteCompany,
    listCompanies,
};
