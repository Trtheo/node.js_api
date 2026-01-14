import { Router } from 'express';
import { getCategories, getCategory, createCategory, updateCategory, deleteCategory } from '../controllers/categoryController';
import { validateCategory } from '../middleware/validation';
import { auth } from '../middleware/auth';

const router = Router();

router.get('/', getCategories);
router.get('/:id', getCategory);
router.post('/', auth, validateCategory, createCategory);
router.put('/:id', auth, validateCategory, updateCategory);
router.delete('/:id', auth, deleteCategory);

export default router;