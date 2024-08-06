import express from 'express';
import expenseController from '../../controllers/expenseController';
import authController from '../../controllers/authController';

import upload from '../../utils/multer';
import { verifyToken } from '../../middleware/authMiddleware';
let router = express.Router();

router.post('/login',  authController.login);
router.post('/register',  authController.register);
router.post('/refresh-token',  authController.refreshToken);


export default router;
