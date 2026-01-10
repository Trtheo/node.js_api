# API Endpoints - Postman Requests

## Categories

### GET All Categories
```
GET http://localhost:3060/api/categories
```

### GET Category by ID
```
GET http://localhost:3060/api/categories/{categoryId}
```

### POST Create Category
```
POST http://localhost:3060/api/categories
Content-Type: application/json

{
  "name": "Electronics",
  "description": "Electronic devices and accessories"
}
```

### PUT Update Category
```
PUT http://localhost:3060/api/categories/{categoryId}
Content-Type: application/json

{
  "name": "Updated Electronics",
  "description": "Updated description"
}
```

### DELETE Category
```
DELETE http://localhost:3060/api/categories/{categoryId}
```

## Products

### GET All Products
```
GET http://localhost:3060/api/products
```

### GET Product by ID
```
GET http://localhost:3060/api/products/{productId}
```

### POST Create Product
```
POST http://localhost:3060/api/products
Content-Type: application/json

{
  "name": "iPhone 15",
  "price": 999.99,
  "description": "Latest iPhone model",
  "categoryId": "{categoryId}",
  "inStock": true,
  "quantity": 50
}
```

### PUT Update Product
```
PUT http://localhost:3060/api/products/{productId}
Content-Type: application/json

{
  "name": "iPhone 15 Pro",
  "price": 1199.99,
  "description": "Updated iPhone model",
  "categoryId": "{categoryId}",
  "inStock": true,
  "quantity": 30
}
```

### DELETE Product
```
DELETE http://localhost:3060/api/products/{productId}
```

## Cart

### GET Cart
```
GET http://localhost:3060/api/cart
```

### GET Cart Item by ID
```
GET http://localhost:3060/api/cart/items/{itemId}
```

### POST Add Item to Cart
```
POST http://localhost:3060/api/cart/items
Content-Type: application/json

{
  "productId": "{productId}",
  "quantity": 2
}
```

### PUT Update Cart Item
```
PUT http://localhost:3060/api/cart/items/{itemId}
Content-Type: application/json

{
  "quantity": 5
}
```

### DELETE Cart Item
```
DELETE http://localhost:3060/api/cart/items/{itemId}
```

### DELETE Clear Cart
```
DELETE http://localhost:3060/api/cart
```

## Sample UUIDs for Testing
- Category ID: `550e8400-e29b-41d4-a716-446655440000`
- Product ID: `6ba7b810-9dad-11d1-80b4-00c04fd430c8`
- Item ID: `6ba7b812-9dad-11d1-80b4-00c04fd430c8`

