# Quick Start Guide - Authentication & Validation

## Step-by-Step Testing Guide

### Step 1: Start the Server
```bash
npm run dev
```

### Step 2: Register a User
```http
POST http://localhost:3061/api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### Step 3: Login (if needed)
```http
POST http://localhost:3061/api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Copy the token from the response!**

### Step 4: Create a Category (Requires Auth)
```http
POST http://localhost:3061/api/categories
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "name": "Electronics",
  "description": "Electronic devices and gadgets"
}
```

**Copy the category _id from the response!**

### Step 5: Create a Product (Requires Auth)
```http
POST http://localhost:3061/api/products
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "name": "iPhone 15",
  "price": 999.99,
  "description": "Latest iPhone",
  "categoryId": "CATEGORY_ID_FROM_STEP_4",
  "inStock": true,
  "quantity": 10
}
```

**Copy the product _id from the response!**

### Step 6: Add Product to Cart (Requires Auth)
```http
POST http://localhost:3061/api/cart/items
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "productId": "PRODUCT_ID_FROM_STEP_5",
  "quantity": 2
}
```

### Step 7: View Your Cart (Requires Auth)
```http
GET http://localhost:3061/api/cart
Authorization: Bearer YOUR_TOKEN_HERE
```

### Step 8: View All Products (Public - No Auth)
```http
GET http://localhost:3061/api/products
```

### Step 9: View All Categories (Public - No Auth)
```http
GET http://localhost:3061/api/categories
```

## Common Validation Errors to Test

### 1. Invalid Email Format
```http
POST http://localhost:3061/api/auth/register
Content-Type: application/json

{
  "email": "not-an-email",
  "password": "password123"
}
```
**Expected:** 400 Bad Request - "Please enter a valid email"

### 2. Short Password
```http
POST http://localhost:3061/api/auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "123"
}
```
**Expected:** 400 Bad Request - "Password must be at least 6 characters"

### 3. Negative Price
```http
POST http://localhost:3061/api/products
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "name": "Product",
  "price": -10.99,
  "categoryId": "CATEGORY_ID",
  "quantity": 5
}
```
**Expected:** 400 Bad Request - "Price must be a positive number"

### 4. Zero Quantity in Cart
```http
POST http://localhost:3061/api/cart/items
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "productId": "PRODUCT_ID",
  "quantity": 0
}
```
**Expected:** 400 Bad Request - "Quantity must be a positive integer"

### 5. Missing Authentication
```http
POST http://localhost:3061/api/categories
Content-Type: application/json

{
  "name": "Books"
}
```
**Expected:** 401 Unauthorized - "Access denied"

### 6. Invalid Category Reference
```http
POST http://localhost:3061/api/products
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "name": "Product",
  "price": 29.99,
  "categoryId": "non-existent-id",
  "quantity": 5
}
```
**Expected:** 400 Bad Request - "Category does not exist"

### 7. Insufficient Stock
```http
POST http://localhost:3061/api/cart/items
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "productId": "PRODUCT_ID",
  "quantity": 999999
}
```
**Expected:** 400 Bad Request - "Insufficient stock"

## Authentication Flow

```
1. Register/Login → Get JWT Token
2. Include token in Authorization header: "Bearer <token>"
3. Token is valid for 7 days
4. Token required for:
   - Creating/Updating/Deleting Categories
   - Creating/Updating/Deleting Products
   - All Cart operations
```

## Validation Rules Summary

### User
-  Email: Required, valid format, unique
-  Password: Required, min 6 characters
-  Name: Optional

### Category
-  Name: Required, non-empty, unique
-  Description: Optional

### Product
-  Name: Required, non-empty
-  Price: Required, >= 0
-  CategoryId: Required, must exist
-  Quantity: Required, >= 0, integer
-  InStock: Required, boolean
-  Description: Optional

### Cart Item
-  ProductId: Required, must exist, in stock
-  Quantity: Required, >= 1, integer, <= available stock

## Tips

1. **Save your token**: After login/register, copy the token for subsequent requests
2. **Use REST Client**: Install REST Client extension in VS Code to use .rest files
3. **Check responses**: Error messages are descriptive and tell you what went wrong
4. **Test validation**: Try invalid inputs to see validation in action
5. **Stock management**: Cart operations check product availability
6. **User isolation**: Each user has their own cart

## Complete Test File

Use `test_auth_validation.rest` for 52 comprehensive test cases covering:
-  User registration and login
-  Authentication errors
-  All validation scenarios
-  Success and error cases
-  Protected route access
-  Stock validation
-  Category and product relationships
