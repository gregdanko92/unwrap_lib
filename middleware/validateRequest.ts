import { Request, Response, NextFunction } from 'express';

// validate checkout request, required fields: isbn, customer_id, due_date

export const validateCheckoutRequest = (req: Request, res: Response, next: NextFunction): void => {
    const { isbn, customer_id, due_date } = req.body;

    if (!isbn || !customer_id || !due_date) {
        res.status(400).send({ error: 'isbn, customer_id, and due_date are required' });
        return;
    }

    next();
};

// validate return request, required fields: isbn, customer_id
export const validateReturnRequest = (req: Request, res: Response, next: NextFunction): void => {
    const { isbn, customer_id } = req.body;

    if (!isbn || !customer_id) {
        res.status(400).send({ error: 'isbn and customer_id are required' });
        return;
    }

    next();
};

// validate create customer request required fields: name, email, customer_id
export const validateCreateCustomerRequest = (req: Request, res: Response, next: NextFunction): void => {
    const { name, email, customer_id } = req.body;

    if (!name || !email || !customer_id) {
        res.status(400).send({ error: 'name, email, and customer_id are required' });
        return;
    }

    next();
};

// validate add book request, required fields: title, author, isbn, copies (copies must be pos)

export const validateAddBookRequest = (req: Request, res: Response, next: NextFunction): void => {
    const { title, author, isbn, copies } = req.body;

    if (!title || !author || !isbn || copies === undefined) {
        res.status(400).send({ error: 'title, author, isbn, and copies are required' });
        return;
    }

    if (typeof copies !== 'number' || copies < 1 || !Number.isInteger(copies)) {
        res.status(400).send({ error: 'copies must be a positive integer' });
        return;
    }

    next();
};
