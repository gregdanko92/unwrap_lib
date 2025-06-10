Library Management System
    Restful API system for managing customers, books, and borrowing procedures

Base URL: http://localhost:3000/api


Set up Procedure:
    after cloning, npm install

Starting Procedure:
    In the terminal:  npm run start

Running the provided Python tests:
    In the terminal: pip install requests
                     python3 test_library_api.py
                     
    Success will read as: 
    .....
    Ran 5 tests in X.XXXs

    OK

Endpoints to Test

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
