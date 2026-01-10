mongo db connection string= mongodb+srv://shopdb:<Password123>@cluster0.5zyjafa.mongodb.net/

in typescript and 
Node.js CRUD Assignment: Categories, Products & Cart API
Task : Categories CRUD
Endpoints
GET    /api/categories
GET    /api/categories/:id
POST   /api/categories
PUT    /api/categories/:id
DELETE /api/categories/:id

Category Model
{
  id: UUID
  name: string
  description?: string
}


 Products CRUD
Endpoints
GET    /api/products
GET    /api/products/:id
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id

Product Model
{
  id: UUID
  name: string
  price: number
  description?: string
  categoryId: UUID
  inStock: boolean
  quantity: number
}


 Cart CRUD
Endpoints
GET    /api/cart/:userId
POST   /api/cart/:userId/items
PUT    /api/cart/:userId/items/:id
DELETE /api/cart/:userId/items/:id
DELETE /api/cart/:userId

UUID Requirement
Use UUID for all IDs
use mongo db 


