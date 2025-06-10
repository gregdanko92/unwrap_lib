import express from 'express';
import { addBook, getBook } from '../controllers/bookController';
import { validateAddBookRequest } from '../middleware/validateRequest';

const router = express.Router();

router.post('/books', validateAddBookRequest, addBook);
router.get('/books/:isbn', getBook);

export default router;
