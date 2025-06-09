#!/usr/bin/env python3
"""
Test script for the Library Management System API.
This script tests all the required functionality of the API.
"""

import argparse
import requests
import unittest
from datetime import datetime, timedelta

# Change this to the base URL of the API
BASE_URL = "http://localhost:3000/api"

class LibraryAPITest(unittest.TestCase):
    
    def setUp(self):
        """Clear any existing data before each test"""
        # Reset endpoint is needed for testing
        try:
            requests.post(f"{BASE_URL}/reset")
        except:
            print("Warning: Reset endpoint not available or not working")
    
    def test_add_book(self):
        """Test adding a book to the library"""
        # Add a book with 3 copies
        book_data = {
            "title": "The Great Gatsby",
            "author": "F. Scott Fitzgerald",
            "isbn": "9780743273565",
            "copies": 3
        }
        response = requests.post(f"{BASE_URL}/books", json=book_data)
        self.assertEqual(response.status_code, 201)
        
        # Verify the book was added
        response = requests.get(f"{BASE_URL}/books/9780743273565")
        self.assertEqual(response.status_code, 200)
        book = response.json()
        self.assertEqual(book["title"], "The Great Gatsby")
        self.assertEqual(book["author"], "F. Scott Fitzgerald")
        self.assertEqual(book["isbn"], "9780743273565")
        self.assertEqual(book["copies"], 3)
        self.assertEqual(book["available_copies"], 3)
    
    def test_create_customer(self):
        """Test creating a customer"""
        customer_data = {
            "name": "John Doe",
            "email": "john.doe@example.com",
            "customer_id": "CUST001"
        }
        response = requests.post(f"{BASE_URL}/customers", json=customer_data)
        self.assertEqual(response.status_code, 201)
        
        # Verify the customer was created
        response = requests.get(f"{BASE_URL}/customers/CUST001")
        self.assertEqual(response.status_code, 200)
        customer = response.json()
        self.assertEqual(customer["name"], "John Doe")
        self.assertEqual(customer["email"], "john.doe@example.com")
        self.assertEqual(customer["customer_id"], "CUST001")
    
    def test_checkout_book(self):
        """Test checking out a book for a customer"""
        # First add a book
        book_data = {
            "title": "1984",
            "author": "George Orwell",
            "isbn": "9780451524935",
            "copies": 2
        }
        response = requests.post(f"{BASE_URL}/books", json=book_data)
        self.assertEqual(response.status_code, 201)
        
        # Create a customer
        customer_data = {
            "name": "Jane Smith",
            "email": "jane.smith@example.com",
            "customer_id": "CUST002"
        }
        requests.post(f"{BASE_URL}/customers", json=customer_data)
        
        # Set a due date (14 days from now)
        due_date = (datetime.now() + timedelta(days=14)).strftime("%Y-%m-%d")
        
        # Checkout the book using isbn
        checkout_data = {
            "isbn": "9780451524935",
            "customer_id": "CUST002",
            "due_date": due_date
        }
        response = requests.post(f"{BASE_URL}/checkouts", json=checkout_data)
        self.assertEqual(response.status_code, 201)
        
        # Verify book is checked out
        response = requests.get(f"{BASE_URL}/books/9780451524935")
        self.assertEqual(response.status_code, 200)
        book = response.json()
        self.assertEqual(book["available_copies"], 1)
        
        # Verify customer has the book
        response = requests.get(f"{BASE_URL}/customers/CUST002/books")
        self.assertEqual(response.status_code, 200)
        checkouts = response.json()
        self.assertEqual(len(checkouts), 1)
        self.assertEqual(checkouts[0]["isbn"], "9780451524935")
        self.assertEqual(checkouts[0]["due_date"], due_date)
    
    def test_get_book_copy(self):
        """Test getting information about a specific book"""
        # First add a book
        book_data = {
            "title": "Moby Dick",
            "author": "Herman Melville",
            "isbn": "9781503280786",
            "copies": 1
        }
        response = requests.post(f"{BASE_URL}/books", json=book_data)
        self.assertEqual(response.status_code, 201)
        
        # Get book details
        response = requests.get(f"{BASE_URL}/books/9781503280786")
        self.assertEqual(response.status_code, 200)
        book = response.json()
        self.assertEqual(book["isbn"], "9781503280786")
        self.assertEqual(book["title"], "Moby Dick")
        self.assertTrue(book["available_copies"] > 0)
    
    def test_return_book(self):
        """Test returning a book"""
        # First add a book
        book_data = {
            "title": "To Kill a Mockingbird",
            "author": "Harper Lee",
            "isbn": "9780061120084",
            "copies": 1
        }
        response = requests.post(f"{BASE_URL}/books", json=book_data)
        self.assertEqual(response.status_code, 201)
        
        # Create a customer
        customer_data = {
            "name": "Bob Johnson",
            "email": "bob.johnson@example.com",
            "customer_id": "CUST003"
        }
        requests.post(f"{BASE_URL}/customers", json=customer_data)
        
        # Checkout the book
        due_date = (datetime.now() + timedelta(days=14)).strftime("%Y-%m-%d")
        checkout_data = {
            "isbn": "9780061120084",
            "customer_id": "CUST003",
            "due_date": due_date
        }
        requests.post(f"{BASE_URL}/checkouts", json=checkout_data)
        
        # Return the book
        return_data = {
            "isbn": "9780061120084",
            "customer_id": "CUST003"
        }
        response = requests.post(f"{BASE_URL}/returns", json=return_data)
        self.assertEqual(response.status_code, 200)
        
        # Verify book is available again
        response = requests.get(f"{BASE_URL}/books/9780061120084")
        self.assertEqual(response.status_code, 200)
        book = response.json()
        self.assertEqual(book["available_copies"], 1)
        
        # Verify customer no longer has the book
        response = requests.get(f"{BASE_URL}/customers/CUST003/books")
        self.assertEqual(response.status_code, 200)
        checkouts = response.json()
        self.assertEqual(len(checkouts), 0)
    
if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Test the Library Management System API")
    parser.add_argument("--url", type=str, default=BASE_URL, help="Base URL of the API")
    args = parser.parse_args()
    BASE_URL = args.url
    unittest.main() 