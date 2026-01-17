import { Router } from 'express';
import { getCart, getCartItem, addCartItem, updateCartItem, deleteCartItem, clearCart } from '../controllers/cartController';
import { validateCartItem } from '../middleware/validation';
import { auth, requireBuyer } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * /api/cart:
 *   get:
 *     tags: [Cart]
 *     summary: Get user cart (Buyer only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cart:
 *                   type: object
 *                   properties:
 *                     items:
 *                       type: array
 *                       items: { $ref: '#/components/schemas/CartItem' }
 *                     totalAmount: { type: number }
 *       403:
 *         description: Insufficient permissions
 *   delete:
 *     tags: [Cart]
 *     summary: Clear cart (Buyer only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared successfully
 *       403:
 *         description: Insufficient permissions
 */
router.get('/', auth, requireBuyer, getCart);

/**
 * @swagger
 * /api/cart/items/{id}:
 *   get:
 *     tags: [Cart]
 *     summary: Get cart item by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Cart item details
 */
router.get('/items/:id', auth, requireBuyer, getCartItem);

/**
 * @swagger
 * /api/cart/items:
 *   post:
 *     tags: [Cart]
 *     summary: Add item to cart (Buyer only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [productId, quantity]
 *             properties:
 *               productId: { type: string }
 *               quantity: { type: integer, minimum: 1 }
 *     responses:
 *       201:
 *         description: Item added to cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string }
 *                 cartItem: { $ref: '#/components/schemas/CartItem' }
 *       400:
 *         description: Validation error
 *       403:
 *         description: Insufficient permissions
 */
router.post('/items', auth, requireBuyer, validateCartItem, addCartItem);

/**
 * @swagger
 * /api/cart/items/{id}:
 *   put:
 *     tags: [Cart]
 *     summary: Update cart item quantity
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
 *             required: [quantity]
 *             properties:
 *               quantity: { type: integer, minimum: 1 }
 *     responses:
 *       200:
 *         description: Cart item updated
 *   patch:
 *     tags: [Cart]
 *     summary: Partially update cart item
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
 *               quantity: { type: integer, minimum: 1 }
 *     responses:
 *       200:
 *         description: Cart item updated
 *   delete:
 *     tags: [Cart]
 *     summary: Remove item from cart
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Item removed from cart
 */
router.put('/items/:id', auth, requireBuyer, updateCartItem);
router.patch('/items/:id', auth, requireBuyer, updateCartItem);
router.delete('/items/:id', auth, requireBuyer, deleteCartItem);
router.delete('/', auth, requireBuyer, clearCart);

export default router;