import { Request, Response } from 'express';
import Customer, { ICustomer } from '../models/Customer';
import Book, { IBook } from '../models/Book';

export const borrowBook = async (req: Request, res: Response): Promise<void> => {
    try {
        const { customerId, bookId, dueDate } = req.body;

        const customer = await Customer.findById(customerId);
        const book = await Book.findById(bookId);

        if (!customer) {
            res.status(404).send({ error: 'Customer not found' });
            return;
        }

        if (!book) {
            res.status(404).send({ error: 'Book not found' });
            return;
        }

        if (customer.checkedOutBooks.length >= 5) {
            res.status(400).send({ error: 'Customer cannot check out more than 5 books' });
            return;
        }

        if (book.availableCopies <= 0) {
            res.status(400).send({ error: 'No available copies for this book' });
            return;
        }

        customer.checkedOutBooks.push({ bookId, dueDate: new Date(dueDate) });
        book.availableCopies -= 1;

        await customer.save();
        await book.save();

        res.send({ message: 'Book checked out successfully' });

    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Internal server error' });
    }
};

export const returnBook = async (req: Request, res: Response): Promise<void> => {
    try {
        const { customerId, bookId } = req.body;

        const customer = await Customer.findById(customerId);
        const book = await Book.findById(bookId);

        if (!customer) {
            res.status(404).send({ error: 'Customer not found' });
            return;
        }

        if (!book) {
            res.status(404).send({ error: 'Book not found' });
            return;
        }

        const index = customer.checkedOutBooks.findIndex(item => item.bookId.toString() === bookId);

        if (index === -1) {
            res.status(400).send({ error: 'Book is not checked out by this customer' });
            return;
        }

        customer.checkedOutBooks.splice(index, 1);
        book.availableCopies += 1;

        await customer.save();
        await book.save();

        res.send({ message: 'Book returned successfully' });

    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Internal server error' });
    }
};
