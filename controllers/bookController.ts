import { Request, Response } from 'express';
import { books } from '../data/store';

export const addBook = (req: Request, res: Response): void => {
    const { title, author, isbn, copies } = req.body;

    const existingBook = books.find(b => b.isbn === isbn);
    if (existingBook) {
        res.status(400).send({ error: 'Book with this ISBN already exists' });
        return;
    }

    const newBook = {
        title,
        author,
        isbn,
        copies,
        available_copies: copies
    };

    books.push(newBook);
    res.status(201).send(newBook);
};

export const getBook = (req: Request, res: Response): void => {
    const book = books.find(b => b.isbn === req.params.isbn);

    if (!book) {
        res.status(404).send({ error: 'Book not found' });
        return;
    }

    res.status(200).send(book);
};

export const getAllBooks = (req: Request, res: Response): void => {
    res.status(200).send(books)}