# Complete Validation Rules Reference

## User Validation

| Field | Required | Type | Validation Rules | Error Message |
|-------|----------|------|------------------|---------------|
| email |  Yes | String | Must match email regex pattern | "Email is required" / "Please enter a valid email" |
| password |  Yes | String | Minimum 6 characters | "Password is required" / "Password must be at least 6 characters" |
| name |  No | String | Trimmed whitespace | - |

**Additional Constraints:**
- Email must be unique (no duplicates)
- Password is automatically hashed before storage
- Password never returned in API responses

---

## Category Validation

| Field | Required | Type | Validation Rules | Error Message |
|-------|----------|------|------------------|---------------|
| name |  Yes | String | Non-empty, unique, trimmed | "Category name is required" / "Name cannot be empty" / "Category name already exists" |
| description |  No | String | Trimmed whitespace | - |

**Additional Constraints:**
- Category name must be unique across all categories
- Whitespace-only names are rejected

---

## Product Validation

| Field | Required | Type | Validation Rules | Error Message |
|-------|----------|------|------------------|---------------|
| name |  Yes | String | Non-empty, trimmed | "Product name is required" / "Name cannot be empty" |
| price |  Yes | Number | >= 0, finite number | "Price is required" / "Price cannot be negative" / "Price must be a valid positive number" |
| description |  No | String | Trimmed whitespace | - |
| categoryId |  Yes | String | Must reference existing category | "Category ID is required" / "Category does not exist" |
| inStock |  Yes | Boolean | true or false | "Stock status is required" |
| quantity |  Yes | Number | >= 0, integer | "Quantity is required" / "Quantity cannot be negative" / "Quantity must be a whole number" |

**Additional Constraints:**
- Price must be a valid finite number (not Infinity or NaN)
- Quantity must be a whole number (no decimals)
- CategoryId is validated against existing categories in database
- Default inStock value is true

---

## Cart Item Validation

| Field | Required | Type | Validation Rules | Error Message |
|-------|----------|------|------------------|---------------|
| productId |  Yes | String | Must reference existing product | "Product ID is required" / "Product not found" |
| quantity |  Yes | Number | >= 1, integer, <= available stock | "Quantity is required" / "Quantity must be at least 1" / "Quantity must be a whole number" / "Insufficient stock" |

**Additional Constraints:**
- Product must exist in database
- Product must be in stock (inStock = true)
- Quantity cannot exceed available product quantity
- Quantity must be a positive integer (minimum 1)
- Each user has isolated cart (userId-based)

---

## Authentication Requirements

### Protected Endpoints (Require JWT Token)

| Endpoint | Method | Auth Required |
|----------|--------|---------------|
| `/api/auth/profile` | GET |  Yes |
| `/api/categories` | POST |  Yes |
| `/api/categories/:id` | PUT |  Yes |
| `/api/categories/:id` | DELETE |  Yes |
| `/api/products` | POST |  Yes |
| `/api/products/:id` | PUT |  Yes |
| `/api/products/:id` | DELETE |  Yes |
| `/api/cart` | GET |  Yes |
| `/api/cart/items` | POST |  Yes |
| `/api/cart/items/:id` | GET |  Yes |
| `/api/cart/items/:id` | PUT |  Yes |
| `/api/cart/items/:id` | DELETE |  Yes |
| `/api/cart` | DELETE |  Yes |

### Public Endpoints (No Auth Required)

| Endpoint | Method | Auth Required |
|----------|--------|---------------|
| `/api/auth/register` | POST |  No |
| `/api/auth/login` | POST |  No |
| `/api/categories` | GET |  No |
| `/api/categories/:id` | GET |  No |
| `/api/products` | GET |  No |
| `/api/products/:id` | GET |  No |

---

## HTTP Status Codes

| Status Code | Meaning | When Used |
|-------------|---------|-----------|
| 200 | OK | Successful GET, PUT requests |
| 201 | Created | Successful POST requests (resource created) |
| 204 | No Content | Successful DELETE requests |
| 400 | Bad Request | Validation errors, invalid input |
| 401 | Unauthorized | Missing or invalid authentication token |
| 404 | Not Found | Resource not found (category, product, cart item) |
| 409 | Conflict | Duplicate unique fields (email, category name) |
| 500 | Internal Server Error | Unexpected server errors |

---

## Validation Error Response Format

```json
{
  "error": "Descriptive error message"
}
```

### Examples:

**Single Validation Error:**
```json
{
  "error": "Price must be a positive number"
}
```

**Multiple Validation Errors:**
```json
{
  "error": "Email is required, Password must be at least 6 characters"
}
```

**Authentication Error:**
```json
{
  "error": "Access denied"
}
```

**Resource Not Found:**
```json
{
  "error": "Product not found"
}
```

**Duplicate Resource:**
```json
{
  "error": "Category name already exists"
}
```

---

## Validation Implementation Layers

### 1. Middleware Validation (Pre-processing)
- Validates request body before reaching controller
- Checks required fields and basic format
- Returns 400 Bad Request immediately if validation fails

### 2. Mongoose Schema Validation (Database Level)
- Validates data types and constraints
- Enforces min/max values
- Checks custom validators
- Ensures data integrity

### 3. Business Logic Validation (Controller Level)
- Validates relationships (category exists, product exists)
- Checks stock availability
- Verifies user permissions
- Handles complex validation scenarios

---

## Testing Checklist

### User Authentication
- [ ] Register with valid email and password
- [ ] Register with invalid email format
- [ ] Register with short password (< 6 chars)
- [ ] Register with duplicate email
- [ ] Login with correct credentials
- [ ] Login with incorrect credentials
- [ ] Access protected route without token
- [ ] Access protected route with invalid token
- [ ] Access protected route with valid token

### Category Validation
- [ ] Create category with valid name
- [ ] Create category with empty name
- [ ] Create category with duplicate name
- [ ] Update category with valid data
- [ ] Update category with duplicate name
- [ ] Delete category (requires auth)

### Product Validation
- [ ] Create product with valid data
- [ ] Create product with negative price
- [ ] Create product with negative quantity
- [ ] Create product with decimal quantity
- [ ] Create product with non-existent category
- [ ] Create product without required fields
- [ ] Update product with valid data
- [ ] Update product with invalid category

### Cart Validation
- [ ] Add item with valid product and quantity
- [ ] Add item with zero quantity
- [ ] Add item with negative quantity
- [ ] Add item with decimal quantity
- [ ] Add item with non-existent product
- [ ] Add item exceeding available stock
- [ ] Update item with valid quantity
- [ ] Update item with invalid quantity
- [ ] Delete item from cart
- [ ] Clear entire cart

---

## Security Best Practices Implemented

 **Password Security**
- Passwords hashed with bcryptjs (10 salt rounds)
- Passwords never returned in responses
- Secure password comparison

 **JWT Security**
- Tokens signed with secret key
- 7-day expiration
- Verified on each protected request

 **Input Sanitization**
- Whitespace trimming
- Type validation
- Format validation (email)

 **Data Integrity**
- Unique constraints (email, category name)
- Foreign key validation (categoryId, productId)
- Stock availability checks

 **User Isolation**
- Cart operations scoped to authenticated user
- No cross-user data access

 **Error Handling**
- Descriptive error messages
- Appropriate HTTP status codes
- No sensitive information in errors
