import { Request, Response } from 'express';
import { books, customers, checkouts } from '../data/store';

export const resetSystem = (req: Request, res: Response): void => {
    books.length = 0;
    customers.length = 0;
    checkouts.length = 0;
    res.status(200).send({ message: 'System reset successful' });
};
