Library Management System
    Restful API system for managing customers, books, and borrowing procedures

README CONTENTS
I. Basic Setup
II. Development Trade-offs
III. Helpful curl commands for testing endpoints


I. BASIC SETUP

Base URL: http://localhost:3000/api

Set up Procedure:
    after cloning, npm install

Starting Procedure:
    In the terminal:  npm run start

Running the provided Python tests:
    In the terminal, separate tab: pip install requests
                     python3 test_library_api.py
                     
    Success will read as: 
    .....
    Ran 5 tests in X.XXXs

    OK


//////

II. DEVELOPMENT TRADE OFFS

Trade-offs I made in development of this API:

1. For data storage, I used in-memory arrays to store data, making this simpler to test and develop. However, data is not persistent if the server restarts. In the future I would integrate a persistent database solution. Also, in memory storage does nothing to handle concurrency issues, but a database integration would help with this as well.
2. In this project I kept all of my business logic in the relevant controller, which I think is ok for a project of this size, but in the future, I would move this logic to a separte service layer to improve the maintainability of the system.
3. I kept validation light in the interest of keeping the project simple (input checks), in the future I would check that all the formattable inputs, like email addresses are validated. 
4. Data model does not account for keeping a history of the system, like a customer's checkout history, or an audit trail of who checked out a specific book, would integrate this in the future.
5. No authentication was integrated, but would certainly be a high priority in the future.
6. For the checkout_id, using UUIDV4 to automatically generate ids. in the future I would expand this to generate customer ids when creating new customers 


//////

III. CURL COMMANDS FOR TESTING ENDPOINTS MANUALLY
  --> Typical 

1. Resetting the system  - useful for testing routes, will clear the data store of customers and books
    
    curl -X POST http://localhost:3000/api/reset

Book Management
1. Add a book - post endpoint to add a book to the library system, requires a title, author, isbn, and number of copies
    
    curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Anarchy, State, and Utopia",
    "author": "Robert Nozick",
    "isbn": "1111",
    "copies": 100
  }'

2.  Get Book Details - get endpoint to get information about a book in the library and how many copies there are. requires the isbn in the url

  curl -X GET http://localhost:3000/api/books/1111

Book Management Edge Cases

1. Missing field(s) --> 400 error

curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Incomplete Book",
    "author": "Some Author"
  }'

2. Add a book with 0 copies --> 400 error

curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Bad Book",
    "author": "Bad Author",
    "isbn": "BADISBN",
    "copies": 0
  }'

3. Add a duplicate ISBN, run the normal addBook, then again --> 400 Error


Customer Management
1. Create a new customer, requires name, email, and customer customer_id
    curl -X POST http://localhost:3000/api/customers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Greg Danko",
    "email": "gregdanko@email.com",
    "customer_id": "CUST002"
  }'

2. Get Customer Details -  requires customer customer_id
curl -X GET http://localhost:3000/api/customers/CUST002

3. Get Customer's checked out books
curl -X GET http://localhost:3000/api/customers/CUST002/books

Customer Management Edge Cases:

1. Missing Field(s) --> 400 error

curl -X POST http://localhost:3000/api/customers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "No Email"
  }'

2. Duplicate customer id, use the normal add customer, do it again --> 400 Error




Borrowing Operations
1. Checkout a Book - you will have to pass a due date in the body, but I have a function here that will set it to two weeks in the future in the request.

When testing, make sure there is a valid customer and isbn that you will associate with you request

DUE_DATE=$(date -v+14d "+%Y-%m-%d") 

curl -X POST http://localhost:3000/api/checkouts \
  -H "Content-Type: application/json" \
  -d "{
    \"isbn\": \"1111\",
    \"customer_id\": \"CUST002\",
    \"due_date\": \"$DUE_DATE\"
  }"

2. Return a book

curl -X POST http://localhost:3000/api/returns \
  -H "Content-Type: application/json" \
  -d '{
    "isbn": "1111",
    "customer_id": "CUST002"
  }'

Borrowing Edge Cases

Checkout cases:

1. Checkout book that does not exist --> 404 error

curl -X POST http://localhost:3000/api/checkouts \
  -H "Content-Type: application/json" \
  -d '{
    "isbn": "NONEXISTENTISBN",
    "customer_id": "CUST001",
    "due_date": "2025-07-01"
  }'

  2. Checkout customer that does not exist --> 404 Error

  curl -X POST http://localhost:3000/api/checkouts \
  -H "Content-Type: application/json" \
  -d '{
    "isbn": "9780743273565",
    "customer_id": "NONEXISTENTCUST",
    "due_date": "2025-07-01"
  }'

  3. Checkout with no available copies, make a book with 1 copy, check it out, try to check it out again with a different customer id (that is registered) --> 400 error

  4. Checkout more than 5 books --> create customer, checkout 5 different books, on 6th book --> 400 error

  5. Checkout the same book for the same customer without returning --> 400 error

  6. Get books for a customer with no books --> returns []

  curl -X GET http://localhost:3000/api/customers/CUST001/books

  7. Get books for a customer that doesn't exist --> []

  curl -X GET http://localhost:3000/api/customers/NONEXISTENTCUST/books

  Return Cases:

  1. Return a book that is not checked out --> 400 error

  curl -X POST http://localhost:3000/api/returns \
  -H "Content-Type: application/json" \
  -d '{
    "isbn": "8989898989989",
    "customer_id": "CUST001"
  }'

  2. Return for a customer that doesn't exist yet --> 400 error

  curl -X POST http://localhost:3000/api/returns \
  -H "Content-Type: application/json" \
  -d '{
    "isbn": "4444444",
    "customer_id": "NONEXISTENTCUST"
  }'

  3. Return a book that doesn't exist --> 400 error

  curl -X POST http://localhost:3000/api/returns \
  -H "Content-Type: application/json" \
  -d '{
    "isbn": "NONEXISTENTISBN",
    "customer_id": "CUST001"
  }'