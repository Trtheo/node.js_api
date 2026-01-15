import { Router } from 'express';
import { getProducts, getProduct, createProduct, updateProduct, deleteProduct } from '../controllers/productController';
import { validateProduct } from '../middleware/validation';
import { auth } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * /api/products:
 *   get:
 *     tags: [Products]
 *     summary: Get all products
 *     responses:
 *       200:
 *         description: List of products
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
 *     summary: Create a new product
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, price, description, categoryId, inStock, quantity]
 *             properties:
 *               name: { type: string }
 *               price: { type: number }
 *               description: { type: string }
 *               categoryId: { type: string }
 *               inStock: { type: boolean }
 *               quantity: { type: integer }
 *     responses:
 *       201:
 *         description: Product created
 */
router.post('/', auth, validateProduct, createProduct);

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
router.put('/:id', auth, validateProduct, updateProduct);
router.patch('/:id', auth, updateProduct);
router.delete('/:id', auth, deleteProduct);

export default router;