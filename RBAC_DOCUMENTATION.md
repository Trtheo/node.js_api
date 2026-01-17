# Role-Based Access Control (RBAC) Documentation

## User Roles

### 1. Buyer (Default Role)
- **Access**: Cart operations only
- **Permissions**:
  - View products and categories (public)
  - Manage personal cart (add, update, remove items)
  - View cart contents

### 2. Seller
- **Access**: Product and category management + buyer permissions
- **Permissions**:
  - All buyer permissions
  - Create, update, delete products
  - Create, update, delete categories
  - Cannot access other users' carts

### 3. Admin
- **Access**: Full system access
- **Permissions**:
  - All seller permissions
  - System administration capabilities
  - Can perform any operation

## API Access Control

### Public Endpoints (No Authentication)
- `GET /api/products` - View all products
- `GET /api/products/:id` - View product details
- `GET /api/categories` - View all categories
- `GET /api/categories/:id` - View category details

### Buyer Only
- `GET /api/cart` - View cart
- `POST /api/cart/items` - Add to cart
- `PUT /api/cart/items/:id` - Update cart item
- `DELETE /api/cart/items/:id` - Remove from cart
- `DELETE /api/cart` - Clear cart

### Seller + Admin Only
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

## Registration with Roles

```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "User Name",
  "role": "buyer" // "buyer", "seller", or "admin"
}
```

If no role is specified, defaults to "buyer".

## Error Responses

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

## Implementation Details

- Roles are stored in the User model as an enum
- JWT tokens include user ID, role is fetched from database on each request
- Middleware functions check user roles before allowing access
- Role hierarchy: Admin > Seller > Buyer