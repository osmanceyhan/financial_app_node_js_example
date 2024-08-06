import { Router } from 'express';
import fs from 'fs';
import path from 'path';

const router = Router();
const routesPath = path.join(__dirname, '../routes');

fs.readdirSync(routesPath).forEach((folder) => {
    const folderPath = path.join(routesPath, folder);

    // Eğer bu bir klasörse
    if (fs.lstatSync(folderPath).isDirectory()) {
        // Klasörün içindeki index.js dosyasını yükle
        const routePath = path.join(folderPath, 'index.js');
        if (fs.existsSync(routePath)) {
            const route = require(routePath).default;
            console.log(`/${folder}`);
            router.use(`/${folder}`, route);
        }
    }
});

export default router;
