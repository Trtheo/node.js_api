Task 4: Role-Based Access Control (RBAC) 
Description
Enhance the API by introducing role-based authorization to control access to resources.
User Roles & Descriptions
1. Admin
System administrator with full access
Permissions
Manage users (update, delete)
Create, update, delete categories
Create, update, delete any product
Access all protected resources
2. Vendor
Seller who manages products
Permissions
Create products
Update and delete only their own products
View categories and products
Restrictions
Cannot manage users
Cannot manage categories
Cannot modify products created by other vendors
3. Customer
End user / buyer
Permissions
View categories and products
Manage own cart (add, update, remove items)
Manage own profile
Restrictions
Cannot create or manage products
Cannot manage categories
Cannot access other users’ data
Role Rules Summary
Admin → Full access
Vendor → Product ownership-based access
Customer → Shopping & profile access only
Task 5: Orders Management (Authenticated & Role-Aware)
Description
Implement an Order system that allows customers to place orders from their cart and track them, while admins can manage all orders.
Orders represent a checkout snapshot of the cart at a specific time.
Order Rules
Orders must be linked to userId from JWT
Orders are created only from the user’s cart
Once an order is placed:
Cart should be cleared
Product prices & quantities are stored in the order (snapshot)
Users can only access their own orders
Order status must be managed securely
Order Status Flow (Example)
pending
confirmed
shipped
delivered
cancelled
Endpoints
Customer (Protected)
POST /api/orders
Create an order from current cart
GET /api/orders
Get all orders for logged-in user
GET /api/orders/:id
Get a single order (own order only)
PATCH /api/orders/:id/cancel
Cancel order (only if status is pending)
Admin (Protected + Role: Admin)
GET /api/admin/orders
Get all orders (all users)
PATCH /api/admin/orders/:id/status
Update order status (confirmed, shipped, delivered, cancelled)
Permissions Summary
Customer
Place orders
View own orders
Cancel own pending orders
Admin
View all orders
Update order status
Vendor
❌ No direct order management (optional extension later)
Validation & Security
Validate cart is not empty before order creation
Prevent modifying completed orders
Ensure strict ownership checks on order access
Use proper HTTP status codes and error messages
Task 6: File Handling & Email Notifications
Description

Enhance the API by adding file upload capabilities and email notification features.
This task focuses on handling user-uploaded files securely and sending transactional emails for important system events.
Part A: File Handling (Uploads & Storage)
Purpose

Allow users to upload and manage files such as profile images or product images.
Features
Upload user profile picture 
Upload product images (Vendor & Admin only)
Update or replace existing files on products
Delete uploaded files when the related resource is deleted
File Validation Requirements
Allowed file types (e.g. images only)
Maximum file size limit not more than 1MB 
Reject unsupported or malicious files 





Part B: Email Notifications
Description
Implement an email notification system to improve user communication and system reliability.
Email notification
User registration (welcome email)
Forgot password (password reset email)
Password successfully changed
Order placed successfully
Order status updated (confirmed, shipped, delivered, cancelled)
Rules
Emails must be sent automatically after the related action
Do not expose sensitive data in email content
Email sending failures should not crash the API.


Task 7: Advanced Database & API Best Practices
Description
Improve the API by making the database faster, safer, and smarter.
This task focuses on indexing, transactions, aggregation, linking related data, seeding test data, and building flexible endpoints with pagination, filtering, sorting, and search.

Part A: Database Indexing
Purpose:
Make the database faster for searches and queries.
Features:
Add indexes to important fields (e.g., email, product name)
Use unique indexes to prevent duplicates
Use text indexes for search
Endpoints:
No new endpoints — indexing improves existing queries like GET /users and GET /products.
Part B: Transactions
Purpose:
Ensure multiple database changes happen together or not at all.
Features:
Create or cancel orders safely
Update product stock correctly
Endpoints:
POST /api/orders → Create order + reduce stock in one transaction
PATCH /api/orders/:id/cancel → Cancel order + restore stock

Part C: Aggregation
Purpose:
Get useful statistics from data.
Features:
Total products per category
Average, min, max product prices
Top 10 most expensive products
Low-stock alerts
Endpoints:
GET /api/products/stats
GET /api/products/top
GET /api/products/low-stock
GET /api/products/price-distribution
Part D: Population & References
Purpose:
Connect related data without duplicating it.
Features:
Link users to reviews and orders
Populate related info when needed
Endpoints:
POST /api/reviews → Add review for a product
GET /api/products/:productId/reviews → Reviews with user info
GET /api/users/me/reviews → Reviews with product info
Part E: Database Seeding
Purpose:
Fill the database with test data for development.
Features:
Add sample users, products, and reviews
Clear old data before adding new
Scripts:
npm run seed:users
npm run seed:products
npm run seed:reviews

Part F: API Best Practices (Pagination, Filtering, Sorting & Search)
Purpose:
Make endpoints flexible, fast, and easy to use.
Features:
Pagination: return limited results per page
Filtering: by category, stock, price range
Sorting: by price, creation date, or name
Search: keyword search using text index
Endpoints:
GET /api/products → Supports pagination, filtering, sorting, and search
GET /api/users → Supports pagination + sorting
