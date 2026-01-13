# API Endpoints - Complete Examples

## Categories (10 Examples)

### GET All Categories
```
GET http://localhost:3061/api/categories
```

### POST Create Categories
```
POST http://localhost:3061/api/categories
Content-Type: application/json

{
  "name": "Electronics",
  "description": "Electronic devices, gadgets, and accessories"
}
```

```
POST http://localhost:3061/api/categories
Content-Type: application/json

{
  "name": "Clothing",
  "description": "Fashion and apparel for all ages"
}
```

```
POST http://localhost:3061/api/categories
Content-Type: application/json

{
  "name": "Books",
  "description": "Educational books, novels, and digital publications"
}
```

```
POST http://localhost:3061/api/categories
Content-Type: application/json

{
  "name": "Sports",
  "description": "Sports equipment and fitness accessories"
}
```

```
POST http://localhost:3061/api/categories
Content-Type: application/json

{
  "name": "Home & Garden",
  "description": "Home improvement and gardening supplies"
}
```

```
POST http://localhost:3061/api/categories
Content-Type: application/json

{
  "name": "Beauty",
  "description": "Cosmetics, skincare, and personal care products"
}
```

```
POST http://localhost:3061/api/categories
Content-Type: application/json

{
  "name": "Automotive",
  "description": "Car parts, accessories, and maintenance products"
}
```

```
POST http://localhost:3061/api/categories
Content-Type: application/json

{
  "name": "Toys",
  "description": "Children's toys, games, and educational materials"
}
```

```
POST http://localhost:3061/api/categories
Content-Type: application/json

{
  "name": "Food",
  "description": "Groceries, snacks, and gourmet food items"
}
```

```
POST http://localhost:3061/api/categories
Content-Type: application/json

{
  "name": "Health",
  "description": "Health supplements, medical supplies, and wellness products"
}
```

### GET Category by ID
```
GET http://localhost:3061/api/categories/{categoryId}
```

### PUT Update Category
```
PUT http://localhost:3061/api/categories/{categoryId}
Content-Type: application/json

{
  "name": "Premium Electronics",
  "description": "High-end electronic devices and premium accessories"
}
```

### DELETE Category
```
DELETE http://localhost:3061/api/categories/{categoryId}
```

## Products (10 Examples)

### GET All Products
```
GET http://localhost:3061/api/products
```

### POST Create Products
```
POST http://localhost:3061/api/products
Content-Type: application/json

{
  "name": "iPhone 15 Pro Max",
  "price": 1199.99,
  "description": "Latest flagship iPhone with titanium design and A17 Pro chip",
  "categoryId": "{electronicsId}",
  "inStock": true,
  "quantity": 25
}
```

```
POST http://localhost:3061/api/products
Content-Type: application/json

{
  "name": "Nike Air Max 270",
  "price": 150.00,
  "description": "Comfortable running shoes with Air Max technology",
  "categoryId": "{clothingId}",
  "inStock": true,
  "quantity": 50
}
```

```
POST http://localhost:3061/api/products
Content-Type: application/json

{
  "name": "JavaScript: The Complete Guide",
  "price": 45.99,
  "description": "Comprehensive JavaScript programming book for developers",
  "categoryId": "{booksId}",
  "inStock": true,
  "quantity": 30
}
```

```
POST http://localhost:3061/api/products
Content-Type: application/json

{
  "name": "Wilson Tennis Racket",
  "price": 89.99,
  "description": "Professional tennis racket for intermediate players",
  "categoryId": "{sportsId}",
  "inStock": true,
  "quantity": 15
}
```

```
POST http://localhost:3061/api/products
Content-Type: application/json

{
  "name": "Smart Garden Sprinkler",
  "price": 199.99,
  "description": "WiFi-enabled automatic sprinkler system",
  "categoryId": "{homeGardenId}",
  "inStock": true,
  "quantity": 12
}
```

```
POST http://localhost:3061/api/products
Content-Type: application/json

{
  "name": "Organic Face Cream",
  "price": 35.50,
  "description": "Natural anti-aging face cream with organic ingredients",
  "categoryId": "{beautyId}",
  "inStock": true,
  "quantity": 40
}
```

```
POST http://localhost:3061/api/products
Content-Type: application/json

{
  "name": "Car Phone Mount",
  "price": 24.99,
  "description": "Universal smartphone holder for car dashboard",
  "categoryId": "{automotiveId}",
  "inStock": true,
  "quantity": 75
}
```

```
POST http://localhost:3061/api/products
Content-Type: application/json

{
  "name": "LEGO Creator Set",
  "price": 79.99,
  "description": "3-in-1 building set for creative construction",
  "categoryId": "{toysId}",
  "inStock": true,
  "quantity": 20
}
```

```
POST http://localhost:3061/api/products
Content-Type: application/json

{
  "name": "Organic Honey",
  "price": 18.99,
  "description": "Pure organic wildflower honey, 500g jar",
  "categoryId": "{foodId}",
  "inStock": true,
  "quantity": 60
}
```

```
POST http://localhost:3061/api/products
Content-Type: application/json

{
  "name": "Vitamin D3 Supplements",
  "price": 22.50,
  "description": "High-potency vitamin D3 capsules, 90 count",
  "categoryId": "{healthId}",
  "inStock": true,
  "quantity": 100
}
```

### GET Product by ID
```
GET http://localhost:3061/api/products/{productId}
```

### PUT Update Product
```
PUT http://localhost:3061/api/products/{productId}
Content-Type: application/json

{
  "name": "iPhone 15 Pro Max - Sale",
  "price": 1099.99,
  "description": "Special discount on flagship iPhone",
  "categoryId": "{electronicsId}",
  "inStock": true,
  "quantity": 20
}
```

### DELETE Product
```
DELETE http://localhost:3061/api/products/{productId}
```

## Cart (10 Examples)

### GET Cart
```
GET http://localhost:3061/api/cart
```

### POST Add Items to Cart
```
POST http://localhost:3061/api/cart/items
Content-Type: application/json

{
  "productId": "{iphoneId}",
  "quantity": 1
}
```

```
POST http://localhost:3061/api/cart/items
Content-Type: application/json

{
  "productId": "{nikeId}",
  "quantity": 2
}
```

```
POST http://localhost:3061/api/cart/items
Content-Type: application/json

{
  "productId": "{bookId}",
  "quantity": 1
}
```

```
POST http://localhost:3061/api/cart/items
Content-Type: application/json

{
  "productId": "{racketId}",
  "quantity": 1
}
```

```
POST http://localhost:3061/api/cart/items
Content-Type: application/json

{
  "productId": "{sprinklerId}",
  "quantity": 1
}
```

```
POST http://localhost:3061/api/cart/items
Content-Type: application/json

{
  "productId": "{faceCreamId}",
  "quantity": 3
}
```

```
POST http://localhost:3061/api/cart/items
Content-Type: application/json

{
  "productId": "{phoneMountId}",
  "quantity": 2
}
```

```
POST http://localhost:3061/api/cart/items
Content-Type: application/json

{
  "productId": "{legoId}",
  "quantity": 1
}
```

```
POST http://localhost:3061/api/cart/items
Content-Type: application/json

{
  "productId": "{honeyId}",
  "quantity": 4
}
```

```
POST http://localhost:3061/api/cart/items
Content-Type: application/json

{
  "productId": "{vitaminId}",
  "quantity": 2
}
```

### GET Cart Item by ID
```
GET http://localhost:3061/api/cart/items/{itemId}
```

### PUT Update Cart Item
```
PUT http://localhost:3061/api/cart/items/{itemId}
Content-Type: application/json

{
  "quantity": 5
}
```

### DELETE Cart Item
```
DELETE http://localhost:3061/api/cart/items/{itemId}
```

### DELETE Clear Cart
```
DELETE http://localhost:3061/api/cart
```

## Validation Examples

### Invalid Price (Negative)
```
POST http://localhost:3061/api/products
Content-Type: application/json

{
  "name": "Invalid Product",
  "price": -10.99,
  "description": "This will fail validation",
  "categoryId": "{categoryId}",
  "inStock": true,
  "quantity": 5
}
```

### Invalid Quantity (Negative)
```
POST http://localhost:3061/api/products
Content-Type: application/json

{
  "name": "Invalid Product",
  "price": 29.99,
  "description": "This will fail validation",
  "categoryId": "{categoryId}",
  "inStock": true,
  "quantity": -5
}
```

### Invalid Cart Quantity (Zero)
```
POST http://localhost:3061/api/cart/items
Content-Type: application/json

{
  "productId": "{productId}",
  "quantity": 0
}
```