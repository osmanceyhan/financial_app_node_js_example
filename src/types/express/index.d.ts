import { Request } from 'express';

declare global {
    namespace Express {
        interface Request {
            user?: any; // user'ın tipini burada belirtmiyoruz çünkü değişken olabilir
        }
    }
}
