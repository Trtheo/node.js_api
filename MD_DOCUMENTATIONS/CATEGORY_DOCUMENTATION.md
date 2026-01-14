# Category Management Documentation

## Overview
Category management system with CRUD operations, validation, and authentication requirements.

## Category Model

### Schema Fields
- **_id**: String, UUID, required
- **name**: String, required, unique, non-empty, trimmed
- **description**: String, optional, trimmed

### Validation Rules
- Name is required and cannot be empty
- Name must be unique across all categories
- Whitespace is trimmed from name and description
- Whitespace-only names are rejected

## API Endpoints

### Get All Categories (Public)
```
GET /api/categories
```

**Success Response (200):**
```json
[
  {
    "_id": "uuid-1",
    "name": "Electronics",
    "description": "Electronic devices and gadgets"
  },
  {
    "_id": "uuid-2",
    "name": "Books",
    "description": "Books and publications"
  }
]
```

### Get Category by ID (Public)
```
GET /api/categories/:id
```

**Success Response (200):**
```json
{
  "_id": "uuid-1",
  "name": "Electronics",
  "description": "Electronic devices and gadgets"
}
```

**Error Response:**
- 404: Category not found

### Create Category (Protected)
```
POST /api/categories
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Electronics",
  "description": "Electronic devices and gadgets"
}
```

**Success Response (201):**
```json
{
  "_id": "uuid-generated",
  "name": "Electronics",
  "description": "Electronic devices and gadgets"
}
```

**Error Responses:**
- 400: Name is required or empty
- 401: Missing or invalid token
- 409: Category name already exists

### Update Category (Protected)
```
PUT /api/categories/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Premium Electronics",
  "description": "High-end electronic devices"
}
```

**Success Response (200):**
```json
{
  "_id": "uuid-1",
  "name": "Premium Electronics",
  "description": "High-end electronic devices"
}
```

**Error Responses:**
- 400: Validation error
- 401: Missing or invalid token
- 404: Category not found
- 409: Category name already exists

### Delete Category (Protected)
```
DELETE /api/categories/:id
Authorization: Bearer <token>
```

**Success Response (204):**
No content

**Error Responses:**
- 401: Missing or invalid token
- 404: Category not found

## Authentication Requirements

### Public Endpoints (No Auth)
- GET /api/categories
- GET /api/categories/:id

### Protected Endpoints (Auth Required)
- POST /api/categories
- PUT /api/categories/:id
- DELETE /api/categories/:id

## Validation Details

### Middleware Validation
- Checks if name field exists
- Checks if name is non-empty after trimming
- Returns 400 if validation fails

### Database Validation
- Enforces unique constraint on name
- Trims whitespace automatically
- Returns 409 if duplicate name

## Implementation Files

- **Model**: `src/models/Category.ts`
- **Controller**: `src/controllers/categoryController.ts`
- **Routes**: `src/routes/categories.ts`
- **Middleware**: `src/middleware/validation.ts`, `src/middleware/auth.ts`

## Error Handling

### Validation Errors (400)
- "Category name is required"
- "Name cannot be empty"

### Authentication Errors (401)
- "Access denied"
- "Invalid token"

### Not Found Errors (404)
- "Category not found"

### Conflict Errors (409)
- "Category name already exists"

## Testing Examples

### Valid Category Creation
```http
POST http://localhost:3061/api/categories
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Electronics",
  "description": "Electronic devices"
}
```

### Empty Name
```http
POST http://localhost:3061/api/categories
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "",
  "description": "Invalid"
}
```
Expected: 400 - "Category name is required"

### Missing Name
```http
POST http://localhost:3061/api/categories
Authorization: Bearer <token>
Content-Type: application/json

{
  "description": "No name provided"
}
```
Expected: 400 - "Category name is required"

### Duplicate Name
```http
POST http://localhost:3061/api/categories
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Electronics",
  "description": "Duplicate"
}
```
Expected: 409 - "Category name already exists"

### No Authentication
```http
POST http://localhost:3061/api/categories
Content-Type: application/json

{
  "name": "Books"
}
```
Expected: 401 - "Access denied"

## Usage Notes

- Categories are referenced by products via categoryId
- Deleting a category does not automatically delete associated products
- Category names are case-sensitive
- Description field is optional
