# Cart Management Documentation

## Overview
Shopping cart system with user-specific carts, stock validation, and item management.

## Cart Model

### Schema Fields
- **userId**: ObjectId, required, unique, references User
- **items**: Array of cart items
  - **_id**: String, UUID
  - **productId**: String, required, references Product
  - **quantity**: Number, required, >= 1, integer

### Validation Rules
- Each user has one unique cart
- ProductId must reference an existing product
- Product must be in stock (inStock = true)
- Quantity must be positive integer (minimum 1)
- Quantity cannot exceed available product stock
- Cart operations are user-specific (isolated by userId)

## API Endpoints

### Get Cart (Protected)
```
GET /api/cart
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "items": [
    {
      "_id": "item-uuid-1",
      "productId": "product-uuid-1",
      "quantity": 2
    },
    {
      "_id": "item-uuid-2",
      "productId": "product-uuid-2",
      "quantity": 1
    }
  ]
}
```

### Get Cart Item by ID (Protected)
```
GET /api/cart/items/:id
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "_id": "item-uuid-1",
  "productId": "product-uuid-1",
  "quantity": 2
}
```

**Error Responses:**
- 401: Missing or invalid token
- 404: Cart not found or item not found

### Add Item to Cart (Protected)
```
POST /api/cart/items
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "product-uuid",
  "quantity": 2
}
```

**Success Response (201):**
```json
{
  "_id": "item-uuid-generated",
  "productId": "product-uuid",
  "quantity": 2
}
```

**Error Responses:**
- 400: Validation error or insufficient stock
- 401: Missing or invalid token
- 404: Product not found

**Notes:**
- If product already in cart, quantity is added to existing item
- Creates cart automatically if user doesn't have one

### Update Cart Item (Protected)
```
PUT /api/cart/items/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": 5
}
```

**Success Response (200):**
```json
{
  "_id": "item-uuid",
  "productId": "product-uuid",
  "quantity": 5
}
```

**Error Responses:**
- 400: Validation error or insufficient stock
- 401: Missing or invalid token
- 404: Cart not found or item not found

### Delete Cart Item (Protected)
```
DELETE /api/cart/items/:id
Authorization: Bearer <token>
```

**Success Response (204):**
No content

**Error Responses:**
- 401: Missing or invalid token
- 404: Cart not found or item not found

### Clear Cart (Protected)
```
DELETE /api/cart
Authorization: Bearer <token>
```

**Success Response (204):**
No content

**Error Response:**
- 401: Missing or invalid token

## Authentication Requirements

All cart endpoints require authentication:
- GET /api/cart
- GET /api/cart/items/:id
- POST /api/cart/items
- PUT /api/cart/items/:id
- DELETE /api/cart/items/:id
- DELETE /api/cart

## Validation Details

### Middleware Validation
- ProductId is required
- Quantity must be >= 1
- Quantity must be integer

### Controller Validation
- Product must exist in database
- Product must be in stock (inStock = true)
- Product quantity must be sufficient for requested amount
- Validates on both add and update operations

### User Isolation
- Cart operations scoped to authenticated user
- Users can only access their own cart
- Each user has one unique cart

## Stock Management

### Add to Cart
- Checks if product exists
- Checks if product.inStock === true
- Checks if product.quantity >= requested quantity
- Does not reserve stock (stock checked at time of operation)

### Update Cart Item
- Checks if product still in stock
- Checks if sufficient quantity available
- Validates new quantity against current stock

## Implementation Files

- **Model**: `src/models/Cart.ts`
- **Controller**: `src/controllers/cartController.ts`
- **Routes**: `src/routes/cart.ts`
- **Middleware**: `src/middleware/validation.ts`, `src/middleware/auth.ts`

## Error Handling

### Validation Errors (400)
- "Product ID is required"
- "Quantity must be a positive integer"
- "Insufficient stock"

### Authentication Errors (401)
- "Access denied"
- "Invalid token"

### Not Found Errors (404)
- "Cart not found"
- "Item not found"
- "Product not found"

## Testing Examples

### Add Item to Cart
```http
POST http://localhost:3061/api/cart/items
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "valid-product-id",
  "quantity": 2
}
```

### Zero Quantity
```http
POST http://localhost:3061/api/cart/items
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "valid-product-id",
  "quantity": 0
}
```
Expected: 400 - "Quantity must be a positive integer"

### Negative Quantity
```http
POST http://localhost:3061/api/cart/items
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "valid-product-id",
  "quantity": -1
}
```
Expected: 400 - "Quantity must be a positive integer"

### Non-Integer Quantity
```http
POST http://localhost:3061/api/cart/items
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "valid-product-id",
  "quantity": 2.5
}
```
Expected: 400 - "Quantity must be a positive integer"

### Missing ProductId
```http
POST http://localhost:3061/api/cart/items
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": 2
}
```
Expected: 400 - "Product ID is required"

### Non-Existent Product
```http
POST http://localhost:3061/api/cart/items
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "non-existent-id",
  "quantity": 1
}
```
Expected: 404 - "Product not found"

### Insufficient Stock
```http
POST http://localhost:3061/api/cart/items
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "valid-product-id",
  "quantity": 999999
}
```
Expected: 400 - "Insufficient stock"

### No Authentication
```http
POST http://localhost:3061/api/cart/items
Content-Type: application/json

{
  "productId": "valid-product-id",
  "quantity": 1
}
```
Expected: 401 - "Access denied"

### Update Item Quantity
```http
PUT http://localhost:3061/api/cart/items/item-uuid
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": 5
}
```

### Get User Cart
```http
GET http://localhost:3061/api/cart
Authorization: Bearer <token>
```

### Clear Cart
```http
DELETE http://localhost:3061/api/cart
Authorization: Bearer <token>
```

## Usage Notes

- Cart is automatically created when user adds first item
- Adding existing product increases quantity instead of creating duplicate
- Stock is not reserved - checked at operation time
- Each user can only have one cart
- Cart persists across sessions
- Deleting a product does not automatically remove it from carts
- Cart items reference products by productId
