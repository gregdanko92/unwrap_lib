import express from 'express';
import { checkoutBook, returnBook } from '../controllers/borrowController';
import { validateCheckoutRequest, validateReturnRequest } from '../middleware/validateRequest';

const router = express.Router();

router.post('/checkouts', validateCheckoutRequest, checkoutBook);
router.post('/returns', validateReturnRequest, returnBook);
export default router;
