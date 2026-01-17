import swaggerJsdoc from 'swagger-jsdoc';

const getServers = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (isProduction) {
    return [{
      url: process.env.PRODUCTION_URL || 'https://node-js-api-zw1r.onrender.com',
      description: 'Production'
    }];
  }
  
  return [{
    url: `http://localhost:${process.env.PORT || 3061}`,
    description: 'Local Development'
  }];
};

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Complete E-Commerce API',
      version: '2.0.0',
      description: 'Full-featured e-commerce REST API with authentication, products, cart, orders, and reviews',
    },
    servers: getServers(),
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
            name: { type: 'string' },
            role: { type: 'string', enum: ['buyer', 'seller', 'admin'] },
            profile: {
              type: 'object',
              properties: {
                firstName: { type: 'string' },
                lastName: { type: 'string' },
                phone: { type: 'string' },
                avatar: { type: 'string' }
              }
            },
            address: {
              type: 'object',
              properties: {
                street: { type: 'string' },
                city: { type: 'string' },
                state: { type: 'string' },
                zipCode: { type: 'string' },
                country: { type: 'string' }
              }
            },
            isActive: { type: 'boolean' },
            emailVerified: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Category: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
          },
        },
        Product: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            price: { type: 'number' },
            description: { type: 'string' },
            categoryId: { type: 'string' },
            inStock: { type: 'boolean' },
            quantity: { type: 'integer' },
            images: { type: 'array', items: { type: 'string' } },
            brand: { type: 'string' },
            sku: { type: 'string' },
            tags: { type: 'array', items: { type: 'string' } },
            averageRating: { type: 'number' },
            reviewCount: { type: 'integer' },
            featured: { type: 'boolean' },
            sellerId: { type: 'string' }
          },
        },
        CartItem: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            productId: { type: 'string' },
            quantity: { type: 'integer' },
          },
        },
        Order: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            userId: { type: 'string' },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  productId: { type: 'string' },
                  name: { type: 'string' },
                  price: { type: 'number' },
                  quantity: { type: 'integer' }
                }
              }
            },
            totalAmount: { type: 'number' },
            status: { type: 'string', enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'] },
            shippingAddress: {
              type: 'object',
              properties: {
                street: { type: 'string' },
                city: { type: 'string' },
                state: { type: 'string' },
                zipCode: { type: 'string' },
                country: { type: 'string' }
              }
            },
            orderDate: { type: 'string', format: 'date-time' }
          },
        },
        Review: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            userId: { type: 'string' },
            productId: { type: 'string' },
            rating: { type: 'integer', minimum: 1, maximum: 5 },
            comment: { type: 'string' },
            verified: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' }
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
        }
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
