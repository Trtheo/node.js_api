import { Router } from 'express';
import { getCart, getCartItem, addCartItem, updateCartItem, deleteCartItem, clearCart } from '../controllers/cartController';
import { validateCartItem } from '../middleware/validation';
import { auth } from '../middleware/auth';

const router = Router();

router.get('/', auth, getCart);
router.get('/items/:id', auth, getCartItem);
router.post('/items', auth, validateCartItem, addCartItem);
router.put('/items/:id', auth, updateCartItem);
router.delete('/items/:id', auth, deleteCartItem);
router.delete('/', auth, clearCart);

export default router;