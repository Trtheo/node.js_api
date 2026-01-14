# User Authentication Documentation

## Overview
User authentication system with JWT tokens, password hashing, and secure login/registration.

## User Model

### Schema Fields
- **email**: String, required, unique, validated with regex
- **password**: String, required, minimum 6 characters, hashed
- **name**: String, optional, trimmed

### Validation Rules
- Email must match format: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Password minimum length: 6 characters
- Email must be unique across all users
- Password automatically hashed before storage using bcryptjs (10 salt rounds)

## API Endpoints

### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Success Response (201):**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

**Error Responses:**
- 400: Invalid email format or password too short
- 409: Email already exists

### Login User
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

**Error Responses:**
- 400: Missing email or password
- 401: Invalid email or password

### Get User Profile
```
GET /api/auth/profile
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

**Error Responses:**
- 401: Missing or invalid token
- 404: User not found

## Security Features

### Password Security
- Passwords hashed using bcryptjs with 10 salt rounds
- Passwords never returned in API responses
- Secure password comparison using bcrypt.compare()

### JWT Token
- Signed with secret key from environment variable
- 7-day expiration
- Contains userId in payload
- Required for protected routes

### Validation
- Email format validation at middleware level
- Email uniqueness enforced at database level
- Password length validation before hashing

## Implementation Files

- **Model**: `src/models/User.ts`
- **Controller**: `src/controllers/authController.ts`
- **Routes**: `src/routes/auth.ts`
- **Middleware**: `src/middleware/auth.ts`, `src/middleware/validation.ts`

## Error Handling

### Validation Errors (400)
- "Email and password are required"
- "Please enter a valid email"
- "Password must be at least 6 characters"

### Authentication Errors (401)
- "Access denied" (missing token)
- "Invalid token"
- "Invalid email or password"

### Conflict Errors (409)
- "User already exists with this email"

## Testing Examples

### Valid Registration
```http
POST http://localhost:3061/api/auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123",
  "name": "Test User"
}
```

### Invalid Email
```http
POST http://localhost:3061/api/auth/register
Content-Type: application/json

{
  "email": "invalid-email",
  "password": "password123"
}
```
Expected: 400 - "Please enter a valid email"

### Short Password
```http
POST http://localhost:3061/api/auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "123"
}
```
Expected: 400 - "Password must be at least 6 characters"

### Duplicate Email
```http
POST http://localhost:3061/api/auth/register
Content-Type: application/json

{
  "email": "existing@example.com",
  "password": "password123"
}
```
Expected: 409 - "User already exists with this email"
