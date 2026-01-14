import { Router } from 'express';
import { getProducts, getProduct, createProduct, updateProduct, deleteProduct } from '../controllers/productController';
import { validateProduct } from '../middleware/validation';
import { auth } from '../middleware/auth';

const router = Router();

router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', auth, validateProduct, createProduct);
router.put('/:id', auth, validateProduct, updateProduct);
router.delete('/:id', auth, deleteProduct);

export default router;