import { Request, Response } from 'express';
import { customers, checkouts, books } from '../data/store';

export const createCustomer = (req: Request, res: Response): void => {
    const { name, email, customer_id } = req.body;

    const existingCustomer = customers.find(c => c.customer_id === customer_id);
    if (existingCustomer) {
        res.status(400).send({ error: 'Customer with this ID already exists' });
        return;
    }

    const newCustomer = {
        name,
        email,
        customer_id
    };

    customers.push(newCustomer);
    res.status(201).send(newCustomer);
};

export const getCustomer = (req: Request, res: Response): void => {
    const customer = customers.find(c => c.customer_id === req.params.customer_id);

    if (!customer) {
        res.status(404).send({ error: 'Customer not found' });
        return;
    }

    res.status(200).send(customer);
};

export const getCustomerBooks = (req: Request, res: Response): void => {
    const { customer_id } = req.params;

    const customerCheckouts = checkouts
        .filter(c => c.customer_id === customer_id)
        .map(c => {
            const book = books.find(b => b.isbn === c.isbn);
            return {
                isbn: c.isbn,
                title: c.title,
                author: book ? book.author : '',
                checkout_date: c.checkout_date,
                due_date: c.due_date
            };
        });

    res.status(200).send(customerCheckouts);
};