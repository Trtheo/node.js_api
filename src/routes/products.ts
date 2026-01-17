import { Router } from 'express';
import { getProducts, getProduct, createProduct, updateProduct, deleteProduct } from '../controllers/productController';
import { validateProduct } from '../middleware/validation';
import { auth, requireSeller } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * /api/products:
 *   get:
 *     tags: [Products]
 *     summary: Get products with search and filtering
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Search in name, description, tags
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *         description: Filter by category ID
 *       - in: query
 *         name: minPrice
 *         schema: { type: number }
 *         description: Minimum price filter
 *       - in: query
 *         name: maxPrice
 *         schema: { type: number }
 *         description: Maximum price filter
 *       - in: query
 *         name: sortBy
 *         schema: { type: string, enum: [price, name, createdAt, rating] }
 *         description: Sort field
 *       - in: query
 *         name: sortOrder
 *         schema: { type: string, enum: [asc, desc] }
 *         description: Sort direction
 *       - in: query
 *         name: page
 *         schema: { type: integer, minimum: 1 }
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, maximum: 100 }
 *         description: Items per page
 *       - in: query
 *         name: featured
 *         schema: { type: boolean }
 *         description: Filter featured products
 *       - in: query
 *         name: inStock
 *         schema: { type: boolean }
 *         description: Filter in-stock products
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 products:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Product' }
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page: { type: integer }
 *                     limit: { type: integer }
 *                     total: { type: integer }
 *                     pages: { type: integer }
 */
router.get('/', getProducts);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     tags: [Products]
 *     summary: Get product by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Product details
 */
router.get('/:id', getProduct);

/**
 * @swagger
 * /api/products:
 *   post:
 *     tags: [Products]
 *     summary: Create a new product (Seller/Admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, price, categoryId, quantity]
 *             properties:
 *               name: { type: string }
 *               price: { type: number, minimum: 0 }
 *               description: { type: string }
 *               categoryId: { type: string }
 *               inStock: { type: boolean }
 *               quantity: { type: integer, minimum: 0 }
 *               images: { type: array, items: { type: string } }
 *               brand: { type: string }
 *               sku: { type: string }
 *               tags: { type: array, items: { type: string } }
 *               featured: { type: boolean }
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string }
 *                 product: { $ref: '#/components/schemas/Product' }
 *       400:
 *         description: Validation error
 *       403:
 *         description: Insufficient permissions
 */
router.post('/', auth, requireSeller, validateProduct, createProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     tags: [Products]
 *     summary: Update product
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               price: { type: number }
 *               description: { type: string }
 *               categoryId: { type: string }
 *               inStock: { type: boolean }
 *               quantity: { type: integer }
 *     responses:
 *       200:
 *         description: Product updated
 *   patch:
 *     tags: [Products]
 *     summary: Partially update product
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               price: { type: number }
 *               description: { type: string }
 *               categoryId: { type: string }
 *               inStock: { type: boolean }
 *               quantity: { type: integer }
 *     responses:
 *       200:
 *         description: Product updated
 *   delete:
 *     tags: [Products]
 *     summary: Delete product
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Product deleted
 */
router.put('/:id', auth, requireSeller, validateProduct, updateProduct);
router.patch('/:id', auth, requireSeller, updateProduct);
router.delete('/:id', auth, requireSeller, deleteProduct);

export default router;