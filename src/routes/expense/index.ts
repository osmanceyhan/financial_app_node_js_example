import express from 'express';
import expenseController from '../../controllers/expenseController';
import upload from '../../utils/multer';
import { verifyToken } from '../../middleware/authMiddleware';

const router = express.Router();

// verifyToken middleware'i ile oturum doğrulaması yapılmış kullanıcıları koruma
router.post('/', verifyToken, upload.single('receiptImage'), expenseController.createExpense);
router.get('/', verifyToken, expenseController.listExpenses);
router.put('/:id', verifyToken, upload.single('receiptImage'), expenseController.updateExpense);
router.delete('/:id', verifyToken, upload.single('receiptImage'), expenseController.deleteExpense);


export default router;
