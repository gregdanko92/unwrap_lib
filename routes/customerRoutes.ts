import express from 'express';
import { createCustomer, getCustomer, getCustomerBooks } from '../controllers/customerController';
import { validateCreateCustomerRequest } from '../middleware/validateRequest';


const router = express.Router();

router.post('/customers', validateCreateCustomerRequest, createCustomer);
router.get('/customers/:customer_id', getCustomer);
router.get('/customers/:customer_id/books', getCustomerBooks);

export default router;
