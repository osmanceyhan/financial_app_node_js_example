import * as ftp from "basic-ftp";
import dotenv from "dotenv";

dotenv.config();

interface FTPConfig {
    host: string;
    user: string;
    password: string;
}

const ftpConfig: FTPConfig = {
    host: process.env.FTP_HOST!,
    user: process.env.FTP_USER!,
    password: process.env.FTP_PASSWORD!
};

export const uploadToFTP = async (filePath: string, remotePath: string) => {
    const client = new ftp.Client();
    client.ftp.verbose = true;

    try {
        await client.access(ftpConfig);
        await client.ensureDir(remotePath);
        await client.uploadFrom(filePath, `${remotePath}/${filePath.split('/').pop()}`);

        return `${remotePath}/${filePath.split('/').pop()}`;
    } catch (err) {
        console.error(err);
        throw new Error("FTP upload failed");
    } finally {
        client.close();
    }
};
