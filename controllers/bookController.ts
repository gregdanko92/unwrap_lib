import { Request, Response } from 'express';
import Book from '../models/Book';

export const addBook = async (req: Request, res: Response): Promise<void> => {
    const { title, author, totalCopies } = req.body;
    const book = new Book({
        title,
        author,
        totalCopies,
        availableCopies: totalCopies
    });
    await book.save();
    res.send(book);
};

export const getBook = async (req: Request, res: Response): Promise<void> => {
    const book = await Book.findById(req.params.id);
    res.send(book);
};