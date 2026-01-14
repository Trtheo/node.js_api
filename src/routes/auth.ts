import { Router } from 'express';
import { register, login, getProfile } from '../controllers/authController';
import { validateRegister, validateLogin } from '../middleware/validation';
import { auth } from '../middleware/auth';

const router = Router();

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.get('/profile', auth, getProfile);

export default router;