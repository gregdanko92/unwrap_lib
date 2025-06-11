
// these interfaces will define the shape of the data, type checking
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

//in memory databases
export const books = new Map<string, Book>();        // Key = isbn
export const customers = new Map<string, Customer>(); // Key = customer_id
export const checkouts: Checkout[] = [];
