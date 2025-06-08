import {Request, Response} from 'express'
import Book from '../models/Book'
import Customer from '../models/Customer'

export const resetSystem = async (req:Request, res:Response): Promise<void> => {
    try {
        await Book.deleteMany()
        await Customer.deleteMany()

        res.send({message: "System Reset, all records of customers and books have been purged"})
    } catch (err){
        console.error(err)
        res.status(500).send({error: "internal server error during sys reset"})
    }
}