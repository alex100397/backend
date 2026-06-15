import express from 'express';
import { signup, login, logout } from '../controllers/authController.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { signupSchema, loginSchema } from '../validators/authValidator.js';
import { authLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

router.post('/signup', authLimiter, validateRequest(signupSchema), signup);
router.post('/login', authLimiter, validateRequest(loginSchema), login);
router.post('/logout', logout);

export default router;