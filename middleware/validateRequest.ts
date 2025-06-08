import { Request, Response, NextFunction } from 'express';

export const validateBorrowRequest = (req: Request, res: Response, next: NextFunction): void => {
    const { customerId, bookId, dueDate } = req.body;

    if (!customerId || !bookId || !dueDate) {
        res.status(400).send({ error: 'customerId, bookId, and dueDate are required' });
        return;
    }

    next();
};
