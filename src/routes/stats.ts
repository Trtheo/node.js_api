import { Router } from 'express';
import { getProductStats, getTopProducts, getLowStockProducts, getPriceDistribution } from '../controllers/statsController';
import { auth, requireSeller } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * /api/stats/products:
 *   get:
 *     tags: [Statistics]
 *     summary: Get product statistics by category
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Product statistics retrieved
 */
router.get('/products', auth, requireSeller, getProductStats);

/**
 * @swagger
 * /api/stats/top-products:
 *   get:
 *     tags: [Statistics]
 *     summary: Get top products by price
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: Top products retrieved
 */
router.get('/top-products', auth, requireSeller, getTopProducts);

/**
 * @swagger
 * /api/stats/low-stock:
 *   get:
 *     tags: [Statistics]
 *     summary: Get low stock products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: threshold
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: Low stock products retrieved
 */
router.get('/low-stock', auth, requireSeller, getLowStockProducts);

/**
 * @swagger
 * /api/stats/price-distribution:
 *   get:
 *     tags: [Statistics]
 *     summary: Get price distribution of products
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Price distribution retrieved
 */
router.get('/price-distribution', auth, requireSeller, getPriceDistribution);

export default router;