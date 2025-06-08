import express from 'express';
import { borrowBook, returnBook } from '../controllers/borrowController';
import { validateBorrowRequest } from '../middleware/validateRequest';


const router = express.Router();

router.post('/checkout',validateBorrowRequest, borrowBook);
router.post('/return', returnBook);

export default router;
