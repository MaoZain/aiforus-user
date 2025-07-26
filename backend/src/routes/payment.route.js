import express from 'express';
import { createCheckoutSession, verifySession } from '../controllers/payment.controller.js';

const router = express.Router();

// 创建 Checkout Session
router.post('/create-checkout-session', createCheckoutSession);

// 验证支付状态
router.post('/verify-session', verifySession);

export default router;