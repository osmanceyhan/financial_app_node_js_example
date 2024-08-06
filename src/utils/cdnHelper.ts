import dotenv from "dotenv";

dotenv.config();

const CDN_URL = process.env.CDN_URL;

export const getCdn = (filePath: string) => {
    return `${CDN_URL}${filePath}`;
};
