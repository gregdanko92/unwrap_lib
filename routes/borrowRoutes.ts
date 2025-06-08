import express from 'express';
import { checkoutBook, returnBook } from '../controllers/borrowController';

const router = express.Router();

router.post('/checkouts', checkoutBook);
router.post('/returns', returnBook);

export default router;
