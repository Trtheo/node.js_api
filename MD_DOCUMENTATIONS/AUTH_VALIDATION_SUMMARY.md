# Authentication & Validation Implementation Summary

## Overview
Complete authentication and validation system implemented for User, Categories, Products, and Cart endpoints.

## Authentication Features

### 1. User Registration & Login
- **JWT-based authentication** with 7-day token expiration
- **Password hashing** using bcryptjs (10 salt rounds)
- **Email validation** with regex pattern
- **Password minimum length** of 6 characters

### 2. Protected Routes
All write operations (POST, PUT, DELETE) require authentication:
- **Categories**: Create, Update, Delete
- **Products**: Create, Update, Delete  
- **Cart**: All operations (Get, Add, Update, Delete, Clear)

### 3. Authentication Middleware
- Validates JWT token from `Authorization: Bearer <token>` header
- Returns 401 for missing or invalid tokens
- Attaches `userId` to request for authenticated routes

## Validation Features

### User Validation
**Email**:
- Required field
- Must match email format (regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`)
- Must be unique (no duplicate emails)

**Password**:
- Required field
- Minimum 6 characters
- Automatically hashed before storage

**Name**:
- Optional field
- Trimmed whitespace

### Category Validation
**Name**:
- Required field
- Cannot be empty string
- Must be unique
- Trimmed whitespace

**Description**:
- Optional field
- Trimmed whitespace

### Product Validation
**Name**:
- Required field
- Cannot be empty string
- Trimmed whitespace

**Price**:
- Required field
- Must be >= 0 (non-negative)
- Must be a valid finite number

**CategoryId**:
- Required field
- Must reference an existing category
- Validated on create and update

**Quantity**:
- Required field
- Must be >= 0 (non-negative)
- Must be an integer (whole number)

**InStock**:
- Required field
- Boolean value
- Defaults to true

**Description**:
- Optional field
- Trimmed whitespace

### Cart Validation
**ProductId**:
- Required field
- Must reference an existing product
- Product must be in stock

**Quantity**:
- Required field
- Must be >= 1 (positive integer)
- Must be an integer (whole number)
- Cannot exceed available product stock

**Stock Validation**:
- Checks product availability before adding/updating
- Validates sufficient quantity in stock

## Error Responses

### Authentication Errors
- **401 Unauthorized**: Missing or invalid token
- **409 Conflict**: Email already exists (registration)
- **401 Unauthorized**: Invalid email or password (login)

### Validation Errors
- **400 Bad Request**: Validation failures with descriptive messages
- **404 Not Found**: Resource not found (category, product, cart item)
- **409 Conflict**: Duplicate unique fields (category name, email)

### Stock Errors
- **400 Bad Request**: Insufficient stock for cart operations

## Security Features

1. **Password Security**:
   - Passwords hashed with bcryptjs
   - Never returned in API responses
   - Secure comparison using bcrypt.compare()

2. **JWT Security**:
   - Signed with secret key from environment variable
   - 7-day expiration
   - Verified on each protected route

3. **Input Sanitization**:
   - Trimmed whitespace on string fields
   - Type validation for numbers and booleans
   - Email format validation

4. **User Isolation**:
   - Cart operations scoped to authenticated user
   - Each user has their own cart

## Testing

Use the `test_auth_validation.rest` file for comprehensive testing:
- 52 test cases covering all scenarios
- Success cases and error cases
- Authentication and validation testing

### Test Flow:
1. Register a user
2. Login to get JWT token
3. Replace `TOKEN` in subsequent requests
4. Create categories and products
5. Test cart operations
6. Test validation errors
7. Test authentication errors

## API Endpoints Summary

### Public Endpoints (No Auth Required)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/categories` - List all categories
- `GET /api/categories/:id` - Get single category
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get single product

### Protected Endpoints (Auth Required)
- `GET /api/auth/profile` - Get user profile
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/cart` - Get user cart
- `GET /api/cart/items/:id` - Get cart item
- `POST /api/cart/items` - Add item to cart
- `PUT /api/cart/items/:id` - Update cart item
- `DELETE /api/cart/items/:id` - Remove cart item
- `DELETE /api/cart` - Clear cart

## Environment Variables Required

```env
PORT=3061
MONGODB_URI=mongodb://localhost:27017/nodejs_assignment_db
JWT_SECRET=your-secret-key-here
```

## Implementation Files

### Models (with validation)
- `src/models/User.ts` - User schema with password hashing
- `src/models/Category.ts` - Category schema with unique name
- `src/models/Product.ts` - Product schema with price/quantity validation
- `src/models/Cart.ts` - Cart schema with quantity validation

### Middleware
- `src/middleware/auth.ts` - JWT authentication middleware
- `src/middleware/validation.ts` - Request validation middleware

### Controllers
- `src/controllers/authController.ts` - Auth logic (register, login, profile)
- `src/controllers/categoryController.ts` - Category CRUD with validation
- `src/controllers/productController.ts` - Product CRUD with category validation
- `src/controllers/cartController.ts` - Cart operations with stock validation

### Routes
- `src/routes/auth.ts` - Auth routes with validation
- `src/routes/categories.ts` - Category routes with auth
- `src/routes/products.ts` - Product routes with auth
- `src/routes/cart.ts` - Cart routes with auth

## Key Features Implemented

 JWT-based authentication
 Password hashing and secure comparison
 Email format validation
 Unique email and category name constraints
 Price and quantity validation (non-negative, integers)
 Category existence validation for products
 Product existence and stock validation for cart
 User-specific cart isolation
 Comprehensive error handling
 Descriptive error messages
 Protected routes for write operations
 Public read access for categories and products
 Input sanitization (trimming)
 Type validation for all fields
