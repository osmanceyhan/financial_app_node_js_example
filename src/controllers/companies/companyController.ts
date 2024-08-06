import companyService from "../../services/companies/companyService";
import { Request, Response } from "express";
import { ICompany } from "../../models/companies/companies";
import { format } from "date-fns";
import { getCdn } from "../../utils/cdnHelper";

const createCompany = async (req: Request, res: Response) => {
    try {
        const company = req.body as ICompany;
        const newCompany = await companyService.createCompany(company);
        res.status(201).json({ message: 'Company created successfully', company: newCompany });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred', error });
    }
}
const updateCompany = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const company = req.body as ICompany;
        const updatedCompany = await companyService.updateCompany(id, company);
        res.status(200).json({ message: 'Company updated successfully', company: updatedCompany });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred', error });
    }
}
const deleteCompany = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await companyService.deleteCompany(id);
        res.status(200).json({ message: 'Company deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred', error });
    }
}
const listCompanies = async (req: Request, res: Response) => {
    try {
        const companies = await companyService.listCompanies();
        res.status(200).json({ message: 'Companies listed successfully', companies });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred', error });
    }
}
export default {
    createCompany,
    updateCompany,
    deleteCompany,
    listCompanies,
}