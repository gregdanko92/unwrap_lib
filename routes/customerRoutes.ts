import express from 'express';
import { createCustomer, getCustomer, getBorrowedBooks } from '../controllers/customerController';

const router = express.Router();

router.post('/', createCustomer);
router.get('/:id', getCustomer);
router.get('/:id/borrowed', getBorrowedBooks);

export default router;
