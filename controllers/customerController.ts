import { Request, Response } from 'express';
import Customer, { ICustomer } from '../models/Customer';

export const createCustomer = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email } = req.body;

        const customer = new Customer({
            name,
            email,
            checkedOutBooks: []
        });

        await customer.save();
        res.send(customer);

    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Internal server error' });
    }
};

export const getCustomer = async (req: Request, res: Response): Promise<void> => {
    try {
        const customer = await Customer.findById(req.params.id).populate('checkedOutBooks.bookId');

        if (!customer) {
            res.status(404).send({ error: 'Customer not found' });
            return;
        }

        res.send(customer);

    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Internal server error' });
    }
};

export const getBorrowedBooks = async (req: Request, res: Response): Promise<void> => {
    try {
        const customer = await Customer.findById(req.params.id).populate('checkedOutBooks.bookId');

        if (!customer) {
            res.status(404).send({ error: 'Customer not found' });
            return;
        }

        res.send(customer.checkedOutBooks);

    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Internal server error' });
    }
};
