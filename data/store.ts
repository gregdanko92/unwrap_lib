export interface Book {
    title: string;
    author: string;
    isbn: string;
    copies: number;
    available_copies: number;
}

export interface Customer {
    name: string;
    email: string;
    customer_id: string;
}

export interface Checkout {
    checkout_id: string;
    isbn: string;
    customer_id: string;
    title: string;
    checkout_date: string;
    due_date: string;
}

//in mem databases
export const books: Book[] = [];
export const customers: Customer[] = [];
export const checkouts: Checkout[] = [];
