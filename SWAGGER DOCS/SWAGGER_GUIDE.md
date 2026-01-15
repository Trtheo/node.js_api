# Swagger API Documentation

## Access Swagger UI

Once the server is running, access the interactive API documentation at:

```
http://localhost:3061/api-docs
```

## API Overview

This API provides endpoints for:
- **Auth**: User registration, login, and profile management
- **Categories**: CRUD operations for product categories
- **Products**: CRUD operations for products
- **Cart**: Shopping cart management

## Authentication

Most endpoints require JWT authentication. To use protected endpoints:

1. Register a new user at `/api/auth/register`
2. Login at `/api/auth/login` to receive a JWT token
3. Click "Authorize" button in Swagger UI
4. Enter: `Bearer YOUR_TOKEN_HERE`
5. Click "Authorize" and "Close"

## Available Operations

### Auth Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (requires auth)

### Category Endpoints
- `GET /api/categories` - Get all categories
- `GET /api/categories/{id}` - Get category by ID
- `POST /api/categories` - Create category (requires auth)
- `PUT /api/categories/{id}` - Update category (requires auth)
- `PATCH /api/categories/{id}` - Partially update category (requires auth)
- `DELETE /api/categories/{id}` - Delete category (requires auth)

### Product Endpoints
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `POST /api/products` - Create product (requires auth)
- `PUT /api/products/{id}` - Update product (requires auth)
- `PATCH /api/products/{id}` - Partially update product (requires auth)
- `DELETE /api/products/{id}` - Delete product (requires auth)

### Cart Endpoints
- `GET /api/cart` - Get user cart (requires auth)
- `GET /api/cart/items/{id}` - Get cart item by ID (requires auth)
- `POST /api/cart/items` - Add item to cart (requires auth)
- `PUT /api/cart/items/{id}` - Update cart item (requires auth)
- `PATCH /api/cart/items/{id}` - Partially update cart item (requires auth)
- `DELETE /api/cart/items/{id}` - Remove item from cart (requires auth)
- `DELETE /api/cart` - Clear entire cart (requires auth)

## Testing with Swagger UI

1. Start your server: `npm run dev`
2. Open browser: `http://localhost:3061/api-docs`
3. Expand any endpoint
4. Click "Try it out"
5. Fill in required parameters
6. Click "Execute"
7. View response below

## Example Workflow

1. **Register**: POST `/api/auth/register`
   ```json
   {
     "name": "John Doe",
     "email": "john@example.com",
     "password": "password123"
   }
   ```

2. **Login**: POST `/api/auth/login`
   ```json
   {
     "email": "john@example.com",
     "password": "password123"
   }
   ```
   Copy the token from response

3. **Authorize**: Click "Authorize" button, enter `Bearer YOUR_TOKEN`

4. **Create Category**: POST `/api/categories`
   ```json
   {
     "name": "Electronics",
     "description": "Electronic devices"
   }
   ```

5. **Create Product**: POST `/api/products`
   ```json
   {
     "name": "iPhone 15",
     "price": 999.99,
     "description": "Latest iPhone",
     "categoryId": "CATEGORY_ID_FROM_STEP_4",
     "inStock": true,
     "quantity": 10
   }
   ```

6. **Add to Cart**: POST `/api/cart/items`
   ```json
   {
     "productId": "PRODUCT_ID_FROM_STEP_5",
     "quantity": 2
   }
   ```

## Notes

- All authenticated endpoints require `Authorization: Bearer <token>` header
- PUT updates entire resource, PATCH updates partial fields
- Validation errors return 400 status with error details
- Authentication errors return 401 status
- Not found errors return 404 status
