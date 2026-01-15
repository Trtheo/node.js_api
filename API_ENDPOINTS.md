# API Endpoints Quick Reference

##  Authentication Endpoints

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/api/auth/register` | Yes | Register new user |
| POST | `/api/auth/login` | No | Login user |
| GET | `/api/auth/profile` | No | Get user profile |

##  Category Endpoints

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/api/categories` | Yes | Get all categories |
| GET | `/api/categories/{id}` | No | Get category by ID |
| POST | `/api/categories` | Yes | Create new category |
| PUT | `/api/categories/{id}` | Yes | Update entire category |
| PATCH | `/api/categories/{id}` | Yes | Partially update category |
| DELETE | `/api/categories/{id}` | Yes | Delete category |

##  Product Endpoints

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/api/products` | No | Get all products |
| GET | `/api/products/{id}` | No | Get product by ID |
| POST | `/api/products` | Yes | Create new product |
| PUT | `/api/products/{id}` | Yes | Update entire product |
| PATCH | `/api/products/{id}` | Yes | Partially update product |
| DELETE | `/api/products/{id}` | Yes | Delete product |

## 🛒 Cart Endpoints

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/api/cart` | Yes | Get user's cart |
| GET | `/api/cart/items/{id}` | Yes | Get specific cart item |
| POST | `/api/cart/items` | Yes | Add item to cart |
| PUT | `/api/cart/items/{id}` | Yes | Update cart item quantity |
| PATCH | `/api/cart/items/{id}` | Yes | Partially update cart item |
| DELETE | `/api/cart/items/{id}` | Yes | Remove item from cart |
| DELETE | `/api/cart` | Yes | Clear entire cart |

##  Summary

- **Total Endpoints**: 22
- **Auth Endpoints**: 3 (1 GET, 2 POST)
- **Category Endpoints**: 6 (2 GET, 1 POST, 1 PUT, 1 PATCH, 1 DELETE)
- **Product Endpoints**: 6 (2 GET, 1 POST, 1 PUT, 1 PATCH, 1 DELETE)
- **Cart Endpoints**: 7 (2 GET, 1 POST, 1 PUT, 1 PATCH, 2 DELETE)

##  Access Swagger UI

```
http://localhost:3061/api-docs
```

##  Authentication

For protected endpoints , include JWT token in header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

##  HTTP Methods Explained

- **GET**: Retrieve data (no body required)
- **POST**: Create new resource (body required)
- **PUT**: Update entire resource (body required, all fields)
- **PATCH**: Update partial resource (body required, only changed fields)
- **DELETE**: Remove resource (no body required)
