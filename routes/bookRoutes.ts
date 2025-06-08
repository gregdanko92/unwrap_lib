import express from 'express';
import { addBook, getBook } from '../controllers/bookController';

const router = express.Router();

router.post('/books', addBook);
router.get('/books/:isbn', getBook);

export default router;
