import { Router } from 'express';
import { createOrder, getOrders, getOrder, updateOrderStatus, cancelOrder } from '../controllers/orderController';
import { validateOrder } from '../middleware/validation';
import { auth, requireBuyer, requireSeller } from '../middleware/auth';

const router = Router();

router.post('/', auth, requireBuyer, validateOrder, createOrder);
router.get('/', auth, requireBuyer, getOrders);
router.get('/:id', auth, requireBuyer, getOrder);
router.put('/:id/status', auth, requireSeller, updateOrderStatus);
router.put('/:id/cancel', auth, requireBuyer, cancelOrder);

export default router;
/**
 * @swagger
 * /api/orders:
 *   post:
 *     tags: [Orders]
 *     summary: Create order from cart (Buyer only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [shippingAddress]
 *             properties:
 *               shippingAddress:
 *                 type: object
 *                 required: [street, city, state, zipCode, country]
 *                 properties:
 *                   street: { type: string }
 *                   city: { type: string }
 *                   state: { type: string }
 *                   zipCode: { type: string }
 *                   country: { type: string }
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string }
 *                 order: { $ref: '#/components/schemas/Order' }
 *       400:
 *         description: Cart is empty or validation error
 *       403:
 *         description: Insufficient permissions
 *   get:
 *     tags: [Orders]
 *     summary: Get user orders (Buyer only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 orders:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Order' }
 *
 * /api/orders/{id}:
 *   get:
 *     tags: [Orders]
 *     summary: Get order by ID (Buyer only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Order retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 order: { $ref: '#/components/schemas/Order' }
 *       404:
 *         description: Order not found
 *
 * /api/orders/{id}/status:
 *   put:
 *     tags: [Orders]
 *     summary: Update order status (Seller/Admin only)
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
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, shipped, delivered, cancelled]
 *     responses:
 *       200:
 *         description: Order status updated
 *       403:
 *         description: Insufficient permissions
 *       404:
 *         description: Order not found
 *
 * /api/orders/{id}/cancel:
 *   put:
 *     tags: [Orders]
 *     summary: Cancel order (Buyer only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Order cancelled successfully
 *       400:
 *         description: Cannot cancel order
 *       404:
 *         description: Order not found
 */