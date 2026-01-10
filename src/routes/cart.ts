import { Router } from 'express';
import { getCart, addCartItem, updateCartItem, deleteCartItem, clearCart } from '../controllers/cartController';

const router = Router();

router.get('/', getCart);
router.post('/items', addCartItem);
router.put('/items/:id', updateCartItem);
router.delete('/items/:id', deleteCartItem);
router.delete('/', clearCart);

export default router;