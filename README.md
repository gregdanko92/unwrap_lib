# Library Management System

RESTful API system for managing customers, books, and borrowing procedures.

---

## Contents

I. [Basic Setup](#i-basic-setup)  
II. [Development Trade-offs](#ii-development-trade-offs)  
III. [Helpful curl Commands for Testing Endpoints](#iii-helpful-curl-commands-for-testing-endpoints)

---

## I. Basic Setup

**Base URL:**  
`http://localhost:3000/api`

**Setup Procedure:**  
After cloning:

```bash
npm install
```

**Starting the API:**  

```bash
npm run start
```

**Running the provided Python tests:**  
In a separate terminal tab:

```bash
pip install requests
python3 test_library_api.py
```

Success will look like:

```
.....
Ran 5 tests in X.XXXs

OK
```

---

## II. Development Trade-offs

Trade-offs made in development of this API:

1. For data storage, I used in-memory arrays to store data, making this simpler to test and develop. However, data is not persistent if the server restarts. In the future, I would integrate a persistent database solution. Also, in-memory storage does nothing to handle concurrency issues, but a database integration would help with this as well.

2. I kept all of my business logic in the relevant controller, which is acceptable for a project of this size, but in the future, I would move this logic to a separate service layer to improve maintainability.

3. I kept validation light in the interest of simplicity (input checks only). In the future, I would validate formattable inputs, such as email addresses.

4. The data model does not currently keep a history of the system, such as a customer's checkout history or an audit trail of who checked out a specific book. I would integrate this in the future.

5. No authentication was integrated, but it would certainly be a high priority in future versions.

6. For the `checkout_id`, I am using UUIDv4 to automatically generate unique IDs. In the future, I would expand this pattern to generate customer IDs when creating new customers.

---

## III. Helpful curl Commands for Testing Endpoints

### System Management

**Resetting the system:**  
Clears the data store of customers and books.

```bash
curl -X POST http://localhost:3000/api/reset
```

---

### Book Management

**Add a book:**  
Requires `title`, `author`, `isbn`, and `copies`.

```bash
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Anarchy, State, and Utopia",
    "author": "Robert Nozick",
    "isbn": "1111",
    "copies": 100
  }'
```

**Get book details:**  
Requires `isbn` in the URL.

```bash
curl -X GET http://localhost:3000/api/books/1111
```

#### Book Management Edge Cases

**Missing field(s):** → 400 error

```bash
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Incomplete Book",
    "author": "Some Author"
  }'
```

**Add a book with 0 copies:** → 400 error

```bash
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Bad Book",
    "author": "Bad Author",
    "isbn": "BADISBN",
    "copies": 0
  }'
```

**Add a duplicate ISBN:** Run the normal addBook request, then run it again → 400 error.

---

### Customer Management

**Create a new customer:**  
Requires `name`, `email`, and `customer_id`.

```bash
curl -X POST http://localhost:3000/api/customers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Greg Danko",
    "email": "gregdanko@email.com",
    "customer_id": "CUST002"
  }'
```

**Get customer details:**  
Requires `customer_id`.

```bash
curl -X GET http://localhost:3000/api/customers/CUST002
```

**Get customer's checked out books:**  

```bash
curl -X GET http://localhost:3000/api/customers/CUST002/books
```

#### Customer Management Edge Cases

**Missing field(s):** → 400 error

```bash
curl -X POST http://localhost:3000/api/customers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "No Email"
  }'
```

**Duplicate customer_id:** Run the normal addCustomer request, then run it again → 400 error.

---

### Borrowing Operations

**Checkout a book:**  
You must pass a `due_date` in the body. This example sets it to two weeks in the future:

```bash
DUE_DATE=$(date -v+14d "+%Y-%m-%d") 

curl -X POST http://localhost:3000/api/checkouts \
  -H "Content-Type: application/json" \
  -d "{
    \"isbn\": \"1111\",
    \"customer_id\": \"CUST002\",
    \"due_date\": \"$DUE_DATE\"
  }"
```

**Return a book:**

```bash
curl -X POST http://localhost:3000/api/returns \
  -H "Content-Type: application/json" \
  -d '{
    "isbn": "1111",
    "customer_id": "CUST002"
  }'
```

#### Borrowing Edge Cases

**Checkout Cases:**

1. Checkout book that does not exist → 404 error

```bash
curl -X POST http://localhost:3000/api/checkouts \
  -H "Content-Type: application/json" \
  -d '{
    "isbn": "NONEXISTENTISBN",
    "customer_id": "CUST001",
    "due_date": "2025-07-01"
  }'
```

2. Checkout customer that does not exist → 404 error

```bash
curl -X POST http://localhost:3000/api/checkouts \
  -H "Content-Type: application/json" \
  -d '{
    "isbn": "9780743273565",
    "customer_id": "NONEXISTENTCUST",
    "due_date": "2025-07-01"
  }'
```

3. Checkout with no available copies → 400 error  
(Make a book with 1 copy, check it out, try again with a different registered customer ID.)

4. Checkout more than 5 books → create customer, checkout 5 different books, 6th checkout → 400 error.

5. Checkout the same book for the same customer without returning → 400 error.

6. Get books for a customer with no books → returns `[]`.

```bash
curl -X GET http://localhost:3000/api/customers/CUST001/books
```

7. Get books for a customer that doesn't exist → returns `[]`.

```bash
curl -X GET http://localhost:3000/api/customers/NONEXISTENTCUST/books
```

**Return Cases:**

1. Return a book that is not checked out → 400 error

```bash
curl -X POST http://localhost:3000/api/returns \
  -H "Content-Type: application/json" \
  -d '{
    "isbn": "8989898989989",
    "customer_id": "CUST001"
  }'
```

2. Return for a customer that doesn't exist → 400 error

```bash
curl -X POST http://localhost:3000/api/returns \
  -H "Content-Type: application/json" \
  -d '{
    "isbn": "4444444",
    "customer_id": "NONEXISTENTCUST"
  }'
```

3. Return a book that doesn't exist → 400 error

```bash
curl -X POST http://localhost:3000/api/returns \
  -H "Content-Type: application/json" \
  -d '{
    "isbn": "NONEXISTENTISBN",
    "customer_id": "CUST001"
  }'
```

---
