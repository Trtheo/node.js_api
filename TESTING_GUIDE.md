#  Swagger API Testing Guide

## Quick Start (3 Steps)

### Step 1: Start Server
```bash
npm run dev
```

### Step 2: Open Swagger UI
```
http://localhost:3061/api-docs
```

### Step 3: Test APIs
Click any endpoint → "Try it out" → Fill data → "Execute"

---

##  Testing Protected Endpoints

### 1. Register a User
```
POST /api/auth/register
```
**Body:**
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}
```

### 2. Login
```
POST /api/auth/login
```
**Body:**
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```
**Copy the token from response!**

### 3. Authorize in Swagger
1. Click **"Authorize"** button ( icon, top right)
2. Enter: `Bearer YOUR_TOKEN_HERE`
3. Click **"Authorize"**
4. Click **"Close"**

Now you can test all protected endpoints! 

---

##  Complete Testing Workflow

### A. Categories

#### 1. Create Category (POST)
```json
{
  "name": "Electronics",
  "description": "Electronic devices and gadgets"
}
```

#### 2. Get All Categories (GET)
No body needed - just click Execute

#### 3. Get Category by ID (GET)
Enter the category ID from step 1

#### 4. Update Category (PUT)
```json
{
  "name": "Premium Electronics",
  "description": "High-end electronic devices"
}
```

#### 5. Partial Update (PATCH)
```json
{
  "description": "Updated description only"
}
```

#### 6. Delete Category (DELETE)
Enter category ID - no body needed

---

### B. Products

#### 1. Create Product (POST)
```json
{
  "name": "iPhone 15 Pro",
  "price": 1199.99,
  "description": "Latest flagship iPhone",
  "categoryId": "YOUR_CATEGORY_ID",
  "inStock": true,
  "quantity": 50
}
```

#### 2. Get All Products (GET)
No body needed

#### 3. Get Product by ID (GET)
Enter product ID

#### 4. Update Product (PUT)
```json
{
  "name": "iPhone 15 Pro Max",
  "price": 1299.99,
  "description": "Updated model",
  "categoryId": "YOUR_CATEGORY_ID",
  "inStock": true,
  "quantity": 30
}
```

#### 5. Partial Update (PATCH)
```json
{
  "price": 1099.99,
  "quantity": 25
}
```

#### 6. Delete Product (DELETE)
Enter product ID

---

### C. Cart

#### 1. Add Item to Cart (POST)
```json
{
  "productId": "YOUR_PRODUCT_ID",
  "quantity": 2
}
```

#### 2. Get Cart (GET)
No body needed - shows all items

#### 3. Get Cart Item by ID (GET)
Enter cart item ID

#### 4. Update Cart Item (PUT)
```json
{
  "quantity": 5
}
```

#### 5. Partial Update (PATCH)
```json
{
  "quantity": 3
}
```

#### 6. Remove Item (DELETE)
Enter cart item ID

#### 7. Clear Cart (DELETE)
No ID needed - clears entire cart

---

##  HTTP Methods Cheat Sheet

| Method | Purpose | Body Required | ID Required |
|--------|---------|---------------|-------------|
| **GET** | Retrieve data | No | Sometimes |
| **POST** | Create new | Yes | No |
| **PUT** | Full update | Yes | Yes |
| **PATCH** | Partial update | Yes | Yes |
| **DELETE** | Remove | No | Yes |

---

## 🔍 Understanding Responses

### Success Responses
- **200 OK** - Request successful (GET, PUT, PATCH, DELETE)
- **201 Created** - Resource created (POST)

### Error Responses
- **400 Bad Request** - Invalid data/validation error
- **401 Unauthorized** - Missing or invalid token
- **404 Not Found** - Resource doesn't exist
- **409 Conflict** - Resource already exists
- **500 Internal Server Error** - Server error

---

##  Pro Tips

1. **Save IDs**: Copy IDs from responses to use in other requests
2. **Use Authorize**: Set token once, works for all protected endpoints
3. **Check Schemas**: Expand "Schemas" section to see data models
4. **Try Examples**: Swagger shows example requests/responses
5. **Test Validation**: Try invalid data to see error handling

---

##  Troubleshooting

### "Unauthorized" Error
- Did you click "Authorize" button?
- Is your token format: `Bearer YOUR_TOKEN`?
- Has your token expired? (Login again)

### "Not Found" Error
- Check if the ID exists
- Use GET all to find valid IDs

### "Validation Error"
- Check required fields
- Verify data types (number vs string)
- Check minimum values (price > 0, quantity > 0)

---

##  Additional Resources

- **Full Documentation**: SWAGGER_IMPLEMENTATION.md
- **Quick Reference**: API_ENDPOINTS.md
- **User Guide**: SWAGGER_GUIDE.md

---

##  Testing Checklist

### Auth
- [ ] Register user
- [ ] Login user
- [ ] Get profile

### Categories
- [ ] Create category
- [ ] Get all categories
- [ ] Get category by ID
- [ ] Update category (PUT)
- [ ] Partial update (PATCH)
- [ ] Delete category

### Products
- [ ] Create product
- [ ] Get all products
- [ ] Get product by ID
- [ ] Update product (PUT)
- [ ] Partial update (PATCH)
- [ ] Delete product

### Cart
- [ ] Add item to cart
- [ ] Get cart
- [ ] Get cart item by ID
- [ ] Update cart item (PUT)
- [ ] Partial update (PATCH)
- [ ] Remove cart item
- [ ] Clear cart


