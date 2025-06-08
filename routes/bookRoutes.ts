import express from 'express';
import { addBook, getBook } from '../controllers/bookController';

const router = express.Router();

router.post('/', addBook);
router.get('/:id', getBook);

export default router;
