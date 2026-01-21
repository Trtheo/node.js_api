import { Router } from 'express';
import { createReview, getProductReviews, updateReview, deleteReview, getUserReviews } from '../controllers/reviewController';
import { validateReview } from '../middleware/validation';
import { auth, requireBuyer } from '../middleware/auth';

const router = Router();

router.post('/', auth, requireBuyer, validateReview, createReview);
router.get('/product/:productId', getProductReviews);
router.put('/:id', auth, requireBuyer, validateReview, updateReview);
router.delete('/:id', auth, requireBuyer, deleteReview);

export default router;
/**
 * @swagger
 * /api/reviews:
 *   post:
 *     tags: [Reviews]
 *     summary: Create product review (Buyer only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [productId, rating]
 *             properties:
 *               productId: { type: string }
 *               rating: { type: integer, minimum: 1, maximum: 5 }
 *               comment: { type: string, maxLength: 500 }
 *     responses:
 *       201:
 *         description: Review created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string }
 *                 review: { $ref: '#/components/schemas/Review' }
 *       400:
 *         description: Already reviewed or validation error
 *       403:
 *         description: Insufficient permissions
 *
 * /api/reviews/product/{productId}:
 *   get:
 *     tags: [Reviews]
 *     summary: Get product reviews (Public)
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Reviews retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reviews:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Review' }
 *
 * /api/reviews/{id}:
 *   put:
 *     tags: [Reviews]
 *     summary: Update review (Buyer only)
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
 *             required: [rating]
 *             properties:
 *               rating: { type: integer, minimum: 1, maximum: 5 }
 *               comment: { type: string, maxLength: 500 }
 *     responses:
 *       200:
 *         description: Review updated successfully
 *       404:
 *         description: Review not found
 *   delete:
 *     tags: [Reviews]
 *     summary: Delete review (Buyer only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *       404:
 *         description: Review not found
 */
/**
 * @swagger
 * /api/reviews/user/me:
 *   get:
 *     tags: [Reviews]
 *     summary: Get current user's reviews with product info
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User reviews retrieved successfully
 */
router.get('/user/me', auth, requireBuyer, getUserReviews);