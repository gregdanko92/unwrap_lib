import { Request, Response } from 'express';
import { books, customers, checkouts } from '../data/store';
import { v4 as uuidv4 } from 'uuid';

export const checkoutBook = (req: Request, res: Response): void => {
    const { isbn, customer_id, due_date } = req.body;

    const customer = customers.find(c => c.customer_id === customer_id);
    const book = books.find(b => b.isbn === isbn);

    if (!customer) {
        res.status(404).send({ error: 'Customer not found' });
        return;
    }

    if (!book) {
        res.status(404).send({ error: 'Book not found' });
        return;
    }

    const customerCheckouts = checkouts.filter(c => c.customer_id === customer_id);
    if (customerCheckouts.length >= 5) {
        res.status(400).send({ error: 'Customer cannot check out more than 5 books' });
        return;
    }

    const alreadyCheckedOut = checkouts.find(c => c.customer_id === customer_id && c.isbn === isbn);
    if (alreadyCheckedOut) {
        res.status(400).send({ error: 'Customer has already checked out this book' });
        return;
    }

    if (book.available_copies <= 0) {
        res.status(400).send({ error: 'No available copies for this book' });
        return;
    }

    const checkout = {
        checkout_id: uuidv4(),
        isbn,
        customer_id,
        title: book.title,
        checkout_date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
        due_date
    };

    checkouts.push(checkout);
    book.available_copies -= 1;

    res.status(201).send(checkout);
};

export const returnBook = (req: Request, res: Response): void => {
    const { isbn, customer_id } = req.body;

    const checkoutIndex = checkouts.findIndex(c => c.isbn === isbn && c.customer_id === customer_id);

    if (checkoutIndex === -1) {
        res.status(400).send({ error: 'Checkout record not found' });
        return;
    }

    // Remove checkout
    checkouts.splice(checkoutIndex, 1);

    // Increase book available copies
    const book = books.find(b => b.isbn === isbn);
    if (book) {
        book.available_copies += 1;
    }

    res.status(200).send({
        message: 'Book returned successfully',
        isbn,
        customer_id,
        return_date: new Date().toISOString().split('T')[0]
    });
};
