# E-Commerce API with JWT Authentication

A complete Node.js REST API for an e-commerce platform with JWT authentication, input validation, and user-specific workflows.

## Features

- **JWT Authentication**: Secure user registration, login, and protected routes
- **Input Validation**: Comprehensive validation for all endpoints
- **User-Specific Carts**: Each user has their own shopping cart
- **Error Handling**: Consistent error responses across all endpoints
- **Stock Management**: Automatic stock validation for cart operations
- **MongoDB Integration**: Persistent data storage with Mongoose

## Tech Stack

- Node.js with TypeScript
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Update the `.env` file with your configuration:
```env
PORT=3061
MONGODB_URI=mongodb://localhost:27017/nodejs_assignment_db
JWT_SECRET=your_jwt_secret_key_here
```

### 3. Start MongoDB
Make sure MongoDB is running on your system.

### 4. Run the Application
```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

The server will start on `http://localhost:3061`

## API Endpoints

### Authentication (No auth required)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (requires auth)

### Categories (All require authentication)
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `POST /api/categories` - Create new category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Products (All require authentication)
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Cart (All require authentication - User-specific)
- `GET /api/cart` - Get user's cart
- `POST /api/cart/items` - Add item to cart
- `GET /api/cart/items/:id` - Get cart item by ID
- `PUT /api/cart/items/:id` - Update cart item quantity
- `DELETE /api/cart/items/:id` - Remove item from cart
- `DELETE /api/cart` - Clear entire cart

## Authentication Flow

### 1. Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

### 2. Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### 3. Use JWT Token
Include the token in the Authorization header for protected routes:
```http
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

## Validation Rules

### User Registration
- Email: Required, valid email format
- Password: Required, minimum 6 characters
- Name: Optional

### Categories
- Name: Required, non-empty, unique
- Description: Optional

### Products
- Name: Required, non-empty
- Price: Required, non-negative number
- CategoryId: Required, must exist
- InStock: Required, boolean
- Quantity: Required, non-negative integer

### Cart Items
- ProductId: Required, must exist
- Quantity: Required, positive integer

## Error Responses

The API returns consistent error responses:

```json
{
  "error": "Error message description"
}
```

Common HTTP status codes:
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing/invalid token)
- `404` - Not Found
- `409` - Conflict (duplicate data)
- `500` - Internal Server Error

## User Workflows

### Complete Shopping Flow
1. Register/Login to get JWT token
2. Browse categories and products
3. Add products to cart (stock validation)
4. Update cart item quantities
5. Remove items or clear cart

### Admin Operations
1. Create categories
2. Add products to categories
3. Update product information
4. Manage inventory

## Testing

Use the `workflows.rest` file with REST Client extension in VS Code, or import the requests into Postman. The file contains:

- Complete authentication workflows
- CRUD operations for all resources
- Validation error examples
- Unauthorized access examples

## Security Features

- Password hashing with bcryptjs
- JWT token expiration (7 days)
- Protected routes with middleware
- Input validation and sanitization
- Error message standardization

## Database Schema

### Users
- email (unique, validated)
- password (hashed)
- name (optional)
- timestamps

### Categories
- _id (UUID)
- name (unique)
- description
- timestamps

### Products
- _id (UUID)
- name
- price (validated)
- description
- categoryId (foreign key)
- inStock (boolean)
- quantity (validated)
- timestamps

### Carts
- userId (foreign key, unique)
- items array:
  - _id (UUID)
  - productId (foreign key)
  - quantity (validated)
- timestamps