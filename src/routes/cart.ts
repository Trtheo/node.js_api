import { Router } from 'express';
import { getCart, getCartItem, addCartItem, updateCartItem, deleteCartItem, clearCart } from '../controllers/cartController';
import { validateCartItem } from '../middleware/validation';
import { auth } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * /api/cart:
 *   get:
 *     tags: [Cart]
 *     summary: Get user cart
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart details
 *   delete:
 *     tags: [Cart]
 *     summary: Clear cart
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared
 */
router.get('/', auth, getCart);

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
router.get('/items/:id', auth, getCartItem);

/**
 * @swagger
 * /api/cart/items:
 *   post:
 *     tags: [Cart]
 *     summary: Add item to cart
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
 *         description: Item added to cart
 */
router.post('/items', auth, validateCartItem, addCartItem);

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
router.put('/items/:id', auth, updateCartItem);
router.patch('/items/:id', auth, updateCartItem);
router.delete('/items/:id', auth, deleteCartItem);
router.delete('/', auth, clearCart);

export default router;