# Complete E-commerce System Documentation

## Overview
This is a full-featured e-commerce REST API built with Node.js, Express, TypeScript, and MongoDB. It includes user authentication, role-based access control, product management, shopping cart, order processing, and review system.

## Features

###  Authentication & Authorization
- JWT-based authentication
- Role-based access control (Admin, Seller, Buyer)
- Password hashing with bcrypt
- User profile management

### 👥 User Roles
- **Buyer**: Can browse products, manage cart, place orders, write reviews
- **Seller**: Can manage products and categories + all buyer permissions
- **Admin**: Full system access + all seller permissions

###  Product Management
- CRUD operations for products
- Advanced search and filtering
- Pagination support
- Product images, SKU, dimensions
- Seller association
- Featured products
- Discount system
- Stock management

###  Category Management
- CRUD operations for categories
- Product categorization

###  Shopping Cart
- Add/remove items
- Update quantities
- User-specific carts
- Cart persistence

###  Order Management
- Checkout process
- Order status tracking
- Shipping address management
- Order history
- Order cancellation
- Stock reduction on order

###  Review System
- Product reviews and ratings
- Verified purchase reviews
- Average rating calculation
- Review CRUD operations

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user (sends activation email)
- `GET /api/auth/activate/:token` - Activate user account
- `POST /api/auth/login` - User login (requires email verification)
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/forgot-password` - Request password reset (sends email)
- `POST /api/auth/reset-password` - Reset password with token

### Admin User Management
- `GET /api/auth/users` - Get all users (Admin only)
- `GET /api/auth/users/:id` - Get user by ID (Admin only)
- `PUT /api/auth/users/:id` - Update any user (Admin only)
- `DELETE /api/auth/users/:id` - Delete user (Admin only)

### Categories
- `GET /api/categories` - Get all categories (Public)
- `GET /api/categories/:id` - Get category by ID (Public)
- `POST /api/categories` - Create category (Seller+)
- `PUT /api/categories/:id` - Update category (Seller+)
- `DELETE /api/categories/:id` - Delete category (Seller+)

### Products
- `GET /api/products` - Get products with search/filter (Public)
- `GET /api/products/:id` - Get product by ID (Public)
- `POST /api/products` - Create product (Seller+)
- `PUT /api/products/:id` - Update product (Seller+)
- `DELETE /api/products/:id` - Delete product (Seller+)

### Cart
- `GET /api/cart` - Get user cart (Buyer+)
- `POST /api/cart/items` - Add item to cart (Buyer+)
- `GET /api/cart/items/:id` - Get cart item (Buyer+)
- `PUT /api/cart/items/:id` - Update cart item (Buyer+)
- `DELETE /api/cart/items/:id` - Remove cart item (Buyer+)
- `DELETE /api/cart` - Clear cart (Buyer+)

### Orders
- `POST /api/orders` - Create order/checkout (Buyer+)
- `GET /api/orders` - Get user orders (Buyer+)
- `GET /api/orders/:id` - Get order by ID (Buyer+)
- `PUT /api/orders/:id/status` - Update order status (Seller+)
- `PUT /api/orders/:id/cancel` - Cancel order (Buyer+)

### Reviews
- `POST /api/reviews` - Create review (Buyer+)
- `GET /api/reviews/product/:productId` - Get product reviews (Public)
- `PUT /api/reviews/:id` - Update review (Buyer+)
- `DELETE /api/reviews/:id` - Delete review (Buyer+)

## Data Models

### User
```typescript
{
  email: string,
  password: string,
  name?: string,
  role: 'buyer' | 'seller' | 'admin',
  profile: {
    firstName?: string,
    lastName?: string,
    phone?: string,
    dateOfBirth?: Date,
    avatar?: string
  },
  address: {
    street?: string,
    city?: string,
    state?: string,
    zipCode?: string,
    country?: string
  },
  isActive: boolean,
  emailVerified: boolean
}
```

### Product
```typescript
{
  name: string,
  price: number,
  description?: string,
  categoryId: string,
  inStock: boolean,
  quantity: number,
  images: string[],
  brand?: string,
  sku?: string,
  weight?: number,
  dimensions: {
    length?: number,
    width?: number,
    height?: number
  },
  tags: string[],
  sellerId: ObjectId,
  averageRating: number,
  reviewCount: number,
  featured: boolean,
  discount: {
    percentage: number,
    startDate?: Date,
    endDate?: Date
  }
}
```

### Order
```typescript
{
  userId: ObjectId,
  items: [{
    productId: ObjectId,
    name: string,
    price: number,
    quantity: number
  }],
  totalAmount: number,
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled',
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded',
  shippingAddress: {
    street: string,
    city: string,
    state: string,
    zipCode: string,
    country: string
  },
  orderDate: Date,
  deliveryDate?: Date
}
```

### Review
```typescript
{
  userId: ObjectId,
  productId: ObjectId,
  rating: number (1-5),
  comment?: string,
  verified: boolean
}
```

## Query Parameters

### Products Search & Filter
- `search` - Search in name, description, tags
- `category` - Filter by category ID
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter
- `sortBy` - Sort field (price, name, createdAt, rating)
- `sortOrder` - Sort direction (asc, desc)
- `page` - Page number for pagination
- `limit` - Items per page
- `featured` - Filter featured products
- `inStock` - Filter in-stock products

## Validation Rules

### User Registration
- Email: Valid email format, unique
- Password: Minimum 6 characters
- Role: Must be valid enum value

### Product Creation
- Name: Required, non-empty
- Price: Required, non-negative number
- Category ID: Required, must exist
- Quantity: Required, non-negative integer
- SKU: Unique if provided

### Order Creation
- Shipping address: All fields required
- Cart: Must not be empty
- Stock: Sufficient quantity must be available

### Review Creation
- Rating: Integer between 1-5
- Comment: Maximum 500 characters
- Product ID: Required, must exist
- One review per user per product

## Error Responses

### 400 Bad Request
```json
{
  "error": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "error": "Access denied"
}
```

### 403 Forbidden
```json
{
  "error": "Access forbidden: insufficient permissions"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 409 Conflict
```json
{
  "error": "Resource already exists"
}
```

## Security Features
- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- Email verification required for login
- Password reset via email
- Account activation via email
- Input validation and sanitization
- CORS enabled
- Request logging with Morgan

## Email Configuration
Set up email service in `.env`:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@ecommerce.com
CLIENT_URL=http://localhost:3000
```

## Getting Started

1. Install dependencies: `npm install`
2. Set environment variables in `.env`
3. Start MongoDB
4. Run: `npm run dev`
5. Access API documentation: `http://localhost:3061/api-docs`



This complete e-commerce system provides all the essential features needed for a modern online store with proper authentication, authorization, and data validation.