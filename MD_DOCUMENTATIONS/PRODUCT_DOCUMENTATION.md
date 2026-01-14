# Product Management Documentation

## Overview
Product management system with CRUD operations, category validation, and stock management.

## Product Model

### Schema Fields
- **_id**: String, UUID, required
- **name**: String, required, non-empty, trimmed
- **price**: Number, required, >= 0, finite
- **description**: String, optional, trimmed
- **categoryId**: String, required, must reference existing category
- **inStock**: Boolean, required, default true
- **quantity**: Number, required, >= 0, integer

### Validation Rules
- Name is required and cannot be empty
- Price must be non-negative and a valid finite number
- CategoryId must reference an existing category in database
- Quantity must be a non-negative integer (whole number)
- InStock is required (defaults to true)

## API Endpoints

### Get All Products (Public)
```
GET /api/products
```

**Success Response (200):**
```json
[
  {
    "_id": "uuid-1",
    "name": "iPhone 15",
    "price": 999.99,
    "description": "Latest iPhone",
    "categoryId": "category-uuid",
    "inStock": true,
    "quantity": 10
  }
]
```

### Get Product by ID (Public)
```
GET /api/products/:id
```

**Success Response (200):**
```json
{
  "_id": "uuid-1",
  "name": "iPhone 15",
  "price": 999.99,
  "description": "Latest iPhone",
  "categoryId": "category-uuid",
  "inStock": true,
  "quantity": 10
}
```

**Error Response:**
- 404: Product not found

### Create Product (Protected)
```
POST /api/products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "iPhone 15",
  "price": 999.99,
  "description": "Latest iPhone",
  "categoryId": "category-uuid",
  "inStock": true,
  "quantity": 10
}
```

**Success Response (201):**
```json
{
  "_id": "uuid-generated",
  "name": "iPhone 15",
  "price": 999.99,
  "description": "Latest iPhone",
  "categoryId": "category-uuid",
  "inStock": true,
  "quantity": 10
}
```

**Error Responses:**
- 400: Validation error or category does not exist
- 401: Missing or invalid token

### Update Product (Protected)
```
PUT /api/products/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "iPhone 15 Pro",
  "price": 1199.99,
  "description": "Updated iPhone",
  "categoryId": "category-uuid",
  "inStock": true,
  "quantity": 15
}
```

**Success Response (200):**
```json
{
  "_id": "uuid-1",
  "name": "iPhone 15 Pro",
  "price": 1199.99,
  "description": "Updated iPhone",
  "categoryId": "category-uuid",
  "inStock": true,
  "quantity": 15
}
```

**Error Responses:**
- 400: Validation error or category does not exist
- 401: Missing or invalid token
- 404: Product not found

### Delete Product (Protected)
```
DELETE /api/products/:id
Authorization: Bearer <token>
```

**Success Response (204):**
No content

**Error Responses:**
- 401: Missing or invalid token
- 404: Product not found

## Authentication Requirements

### Public Endpoints (No Auth)
- GET /api/products
- GET /api/products/:id

### Protected Endpoints (Auth Required)
- POST /api/products
- PUT /api/products/:id
- DELETE /api/products/:id

## Validation Details

### Middleware Validation
- Name must be non-empty
- Price must be >= 0
- CategoryId is required
- Quantity must be >= 0 and integer

### Controller Validation
- CategoryId must reference existing category in database
- Validates on both create and update operations

### Database Validation
- Price must be finite number (not Infinity or NaN)
- Quantity must be whole number (no decimals)
- All required fields enforced

## Implementation Files

- **Model**: `src/models/Product.ts`
- **Controller**: `src/controllers/productController.ts`
- **Routes**: `src/routes/products.ts`
- **Middleware**: `src/middleware/validation.ts`, `src/middleware/auth.ts`

## Error Handling

### Validation Errors (400)
- "Product name is required"
- "Price must be a positive number"
- "Category ID is required"
- "Category does not exist"
- "Quantity must be a non-negative integer"
- "Price cannot be negative"
- "Quantity cannot be negative"

### Authentication Errors (401)
- "Access denied"
- "Invalid token"

### Not Found Errors (404)
- "Product not found"

## Testing Examples

### Valid Product Creation
```http
POST http://localhost:3061/api/products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "iPhone 15",
  "price": 999.99,
  "description": "Latest iPhone",
  "categoryId": "valid-category-id",
  "inStock": true,
  "quantity": 10
}
```

### Negative Price
```http
POST http://localhost:3061/api/products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Product",
  "price": -10.99,
  "categoryId": "valid-category-id",
  "quantity": 5
}
```
Expected: 400 - "Price must be a positive number"

### Negative Quantity
```http
POST http://localhost:3061/api/products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Product",
  "price": 29.99,
  "categoryId": "valid-category-id",
  "quantity": -5
}
```
Expected: 400 - "Quantity must be a non-negative integer"

### Non-Integer Quantity
```http
POST http://localhost:3061/api/products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Product",
  "price": 29.99,
  "categoryId": "valid-category-id",
  "quantity": 5.5
}
```
Expected: 400 - "Quantity must be a non-negative integer"

### Invalid Category
```http
POST http://localhost:3061/api/products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Product",
  "price": 29.99,
  "categoryId": "non-existent-id",
  "quantity": 5
}
```
Expected: 400 - "Category does not exist"

### Missing Required Fields
```http
POST http://localhost:3061/api/products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Product"
}
```
Expected: 400 - Validation error for missing fields

### No Authentication
```http
POST http://localhost:3061/api/products
Content-Type: application/json

{
  "name": "Product",
  "price": 29.99,
  "categoryId": "valid-category-id",
  "quantity": 5
}
```
Expected: 401 - "Access denied"

## Usage Notes

- Products are linked to categories via categoryId
- Category must exist before creating product
- Quantity represents available stock
- InStock boolean indicates availability status
- Price accepts decimal values
- Quantity must be whole numbers only
