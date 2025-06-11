import { Request, Response } from 'express';
import { customers, checkouts, books, Customer } from '../data/store';

export const createCustomer = (req: Request, res: Response): void => {
    const { name, email, customer_id } = req.body;

    if (customers.has(customer_id)) {
        res.status(400).send({ error: 'Customer with this ID already exists' });
        return;
    }

    const newCustomer: Customer = {
        name,
        email,
        customer_id
    };

    customers.set(customer_id, newCustomer);
    res.status(201).send(newCustomer);
};

export const getCustomer = (req: Request, res: Response): void => {
    const customer = customers.get(req.params.customer_id);

    if (!customer) {
        res.status(404).send({ error: 'Customer not found' });
        return;
    }

    res.status(200).send(customer);
};

export const getCustomerBooks = (req: Request, res: Response): void => {
    const { customer_id } = req.params;

    const customer = customers.get(customer_id);

    if (!customer) {
        res.status(404).send({ error: 'Customer not found' });
        return;
    }

    const customerCheckouts = checkouts
        .filter(c => c.customer_id === customer_id)
        .map(c => {
            const book = books.get(c.isbn);
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

export const getAllCustomers = (req: Request, res: Response): void => {
    const allCustomers = Array.from(customers.values());
    res.status(200).send(allCustomers)
}