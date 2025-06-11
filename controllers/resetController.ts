import { Request, Response } from 'express';
import { books, customers, checkouts } from '../data/store';

export const resetSystem = (req: Request, res: Response): void => {
    books.clear()
    customers.clear()
    checkouts.length = 0;
    res.status(200).send({ message: 'System reset successful' });
};
