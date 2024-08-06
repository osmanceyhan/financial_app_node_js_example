import Company,{ICompany} from '../../models/companies/companies';

 const createCompany = async (company: ICompany): Promise<ICompany> => {
    return await Company.create(company);
 }
    const updateCompany = async (id: string, company: ICompany): Promise<ICompany | null> => {
        return await
        Company.findByIdAndUpdate(id, company, { new: true });
    }
    const deleteCompany = async (id: string): Promise<void> => {
        await
        Company.findByIdAndDelete(id);
    }
    const listCompanies = async (): Promise<ICompany[]> => {
        return await
        Company.find();
    }

    export default {
        createCompany,
        updateCompany,
        deleteCompany,
        listCompanies,
    };