import express from 'express';
import { addBook, getBook, getAllBooks } from '../controllers/bookController';
import { validateAddBookRequest } from '../middleware/validateRequest';

const router = express.Router();

router.post('/books', validateAddBookRequest, addBook);
router.get('/books/:isbn', getBook);
router.get('/books', getAllBooks); 


export default router;
