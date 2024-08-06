import dotenv from 'dotenv';
dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET || 'secret';
export const JWT_EXPIRATION = '1h'; // Token süresi (1 saat)
export const REFRESH_TOKEN_EXPIRATION = 7; // Refresh token süresi (7 gün)
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh_secret';
