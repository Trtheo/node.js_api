# Authentication & Validation Flow Diagram

##  Authentication Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     USER REGISTRATION FLOW                       │
└─────────────────────────────────────────────────────────────────┘

Client Request
    │
    ├─→ POST /api/auth/register
    │   Body: { email, password, name }
    │
    ↓
Validation Middleware (validateRegister)
    │
    ├─→ Check email format (regex)
    ├─→ Check password length (>= 6)
    ├─→ Check required fields
    │
    ↓
Auth Controller (register)
    │
    ├─→ Check if email already exists
    ├─→ Create new User document
    ├─→ Hash password (bcryptjs)
    ├─→ Save to database
    ├─→ Generate JWT token (7-day expiration)
    │
    ↓
Response
    └─→ 201 Created
        { token, user: { id, email, name } }


┌─────────────────────────────────────────────────────────────────┐
│                        USER LOGIN FLOW                           │
└─────────────────────────────────────────────────────────────────┘

Client Request
    │
    ├─→ POST /api/auth/login
    │   Body: { email, password }
    │
    ↓
Validation Middleware (validateLogin)
    │
    ├─→ Check required fields
    │
    ↓
Auth Controller (login)
    │
    ├─→ Find user by email
    ├─→ Compare password (bcrypt.compare)
    ├─→ Generate JWT token (7-day expiration)
    │
    ↓
Response
    └─→ 200 OK
        { token, user: { id, email, name } }


┌─────────────────────────────────────────────────────────────────┐
│                    PROTECTED ROUTE ACCESS                        │
└─────────────────────────────────────────────────────────────────┘

Client Request
    │
    ├─→ POST /api/categories
    │   Headers: Authorization: Bearer <token>
    │   Body: { name, description }
    │
    ↓
Auth Middleware
    │
    ├─→ Extract token from header
    ├─→ Verify token (jwt.verify)
    ├─→ Attach userId to request
    │
    ↓
Validation Middleware (validateCategory)
    │
    ├─→ Check required fields
    ├─→ Check name is non-empty
    │
    ↓
Category Controller (createCategory)
    │
    ├─→ Create category with UUID
    ├─→ Save to database
    │
    ↓
Response
    └─→ 201 Created
        { _id, name, description }
```

##  Validation Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    PRODUCT CREATION FLOW                         │
└─────────────────────────────────────────────────────────────────┘

Client Request
    │
    ├─→ POST /api/products
    │   Headers: Authorization: Bearer <token>
    │   Body: { name, price, categoryId, quantity, inStock }
    │
    ↓
┌───────────────────────────────────────────────────────────────┐
│ LAYER 1: Auth Middleware                                      │
├───────────────────────────────────────────────────────────────┤
│  Verify JWT token                                           │
│  Extract userId                                             │
└───────────────────────────────────────────────────────────────┘
    │
    ↓
┌───────────────────────────────────────────────────────────────┐
│ LAYER 2: Validation Middleware (validateProduct)             │
├───────────────────────────────────────────────────────────────┤
│  Check name is non-empty                                    │
│  Check price >= 0                                           │
│  Check categoryId exists                                    │
│  Check quantity >= 0 and integer                            │
└───────────────────────────────────────────────────────────────┘
    │
    ↓
┌───────────────────────────────────────────────────────────────┐
│ LAYER 3: Business Logic (Controller)                         │
├───────────────────────────────────────────────────────────────┤
│  Verify category exists in database                         │
│  Create product with UUID                                   │
└───────────────────────────────────────────────────────────────┘
    │
    ↓
┌───────────────────────────────────────────────────────────────┐
│ LAYER 4: Mongoose Schema Validation                          │
├───────────────────────────────────────────────────────────────┤
│  Validate data types                                        │
│  Check min/max constraints                                  │
│  Run custom validators                                      │
│  Ensure data integrity                                      │
└───────────────────────────────────────────────────────────────┘
    │
    ↓
Response
    └─→ 201 Created
        { _id, name, price, description, categoryId, inStock, quantity }


┌─────────────────────────────────────────────────────────────────┐
│                      CART ITEM ADDITION FLOW                     │
└─────────────────────────────────────────────────────────────────┘

Client Request
    │
    ├─→ POST /api/cart/items
    │   Headers: Authorization: Bearer <token>
    │   Body: { productId, quantity }
    │
    ↓
Auth Middleware
    │
    ├─→ Verify token
    ├─→ Extract userId
    │
    ↓
Validation Middleware (validateCartItem)
    │
    ├─→ Check productId exists
    ├─→ Check quantity >= 1 and integer
    │
    ↓
Cart Controller (addCartItem)
    │
    ├─→ Find product by productId
    ├─→ Check product exists
    ├─→ Check product.inStock === true
    ├─→ Check product.quantity >= requested quantity
    ├─→ Find or create user's cart
    ├─→ Add item or update existing quantity
    ├─→ Save cart
    │
    ↓
Response
    └─→ 201 Created
        { _id, productId, quantity }
```

##  Error Handling Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      ERROR HANDLING FLOW                         │
└─────────────────────────────────────────────────────────────────┘

Request Processing
    │
    ├─→ Any Error Occurs
    │
    ↓
Error Handler Middleware
    │
    ├─→ ValidationError (Mongoose)
    │   └─→ 400 Bad Request
    │       { error: "Field validation messages" }
    │
    ├─→ Duplicate Key Error (11000)
    │   └─→ 409 Conflict
    │       { error: "field already exists" }
    │
    ├─→ CastError (Invalid ID)
    │   └─→ 400 Bad Request
    │       { error: "Invalid ID format" }
    │
    ├─→ JsonWebTokenError
    │   └─→ 401 Unauthorized
    │       { error: "Invalid token" }
    │
    ├─→ TokenExpiredError
    │   └─→ 401 Unauthorized
    │       { error: "Token expired" }
    │
    └─→ Other Errors
        └─→ 500 Internal Server Error
            { error: "Internal server error" }
```

##  Complete Request Lifecycle

```
┌─────────────────────────────────────────────────────────────────┐
│              COMPLETE REQUEST LIFECYCLE EXAMPLE                  │
│              (Creating a Product with Validation)                │
└─────────────────────────────────────────────────────────────────┘

1. CLIENT REQUEST
   ↓
   POST /api/products
   Authorization: Bearer eyJhbGc...
   { "name": "iPhone", "price": 999, "categoryId": "abc123", "quantity": 10 }

2. EXPRESS MIDDLEWARE CHAIN
   ↓
   app.use(morgan('combined'))      → Log request
   app.use(express.json())          → Parse JSON body

3. ROUTE MATCHING
   ↓
   router.post('/', auth, validateProduct, createProduct)

4. AUTH MIDDLEWARE
   ↓
    Extract token from header
    Verify JWT signature
    Check expiration
    Attach userId to request
    If fails → 401 Unauthorized

5. VALIDATION MIDDLEWARE
   ↓
    Check name is non-empty
    Check price >= 0
    Check categoryId exists
    Check quantity >= 0 and integer
    If fails → 400 Bad Request

6. CONTROLLER LOGIC
   ↓
    Verify category exists in DB
    Create Product document
    Generate UUID for _id
    If fails → 400/404/500

7. MONGOOSE VALIDATION
   ↓
    Validate schema constraints
    Run custom validators
    Save to database
    If fails → 400 Bad Request

8. SUCCESS RESPONSE
   ↓
   201 Created
   { "_id": "uuid", "name": "iPhone", "price": 999, ... }

9. ERROR HANDLING (if any step fails)
   ↓
   Error Handler Middleware
   → Appropriate status code
   → Descriptive error message
```

##  Validation Layers Comparison

```
┌──────────────────┬─────────────────┬──────────────────┬─────────────────┐
│ Validation Layer │ When It Runs    │ What It Checks   │ Error Response  │
├──────────────────┼─────────────────┼──────────────────┼─────────────────┤
│ Middleware       │ Before          │ Basic format     │ 400 Bad Request │
│                  │ controller      │ Required fields  │                 │
│                  │                 │ Simple rules     │                 │
├──────────────────┼─────────────────┼──────────────────┼─────────────────┤
│ Controller       │ During          │ Business logic   │ 400/404/409     │
│                  │ processing      │ Relationships    │                 │
│                  │                 │ Existence checks │                 │
├──────────────────┼─────────────────┼──────────────────┼─────────────────┤
│ Mongoose Schema  │ Before DB save  │ Data types       │ 400 Bad Request │
│                  │                 │ Constraints      │                 │
│                  │                 │ Custom rules     │                 │
└──────────────────┴─────────────────┴──────────────────┴─────────────────┘
```

##  Security Layers

```
┌─────────────────────────────────────────────────────────────────┐
│                        SECURITY LAYERS                           │
└─────────────────────────────────────────────────────────────────┘

Layer 1: Network Security
    │
    └─→ HTTPS (in production)

Layer 2: Authentication
    │
    ├─→ JWT Token Verification
    ├─→ Token Expiration (7 days)
    └─→ Bearer Token in Header

Layer 3: Authorization
    │
    ├─→ Protected Routes (write operations)
    ├─→ User-specific Resources (cart)
    └─→ Public Read Access (products, categories)

Layer 4: Input Validation
    │
    ├─→ Middleware Validation
    ├─→ Schema Validation
    └─→ Business Logic Validation

Layer 5: Data Security
    │
    ├─→ Password Hashing (bcryptjs)
    ├─→ No Sensitive Data in Responses
    └─→ Secure Password Comparison

Layer 6: Error Handling
    │
    ├─→ Safe Error Messages
    ├─→ No Stack Traces to Client
    └─→ Appropriate Status Codes
```

This multi-layered approach ensures robust security and data integrity!
