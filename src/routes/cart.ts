import { Router } from 'express';
import { getCart, getCartItem, addCartItem, updateCartItem, deleteCartItem, clearCart } from '../controllers/cartController';

const router = Router();

router.get('/', getCart);
router.get('/items/:id', getCartItem);
router.post('/items', addCartItem);
router.put('/items/:id', updateCartItem);
router.delete('/items/:id', deleteCartItem);
router.delete('/', clearCart);

export default router;