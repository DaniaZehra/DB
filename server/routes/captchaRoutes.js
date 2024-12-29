import express from 'express';
import { verifyCaptchaController } from '../controllers/captchaController.js';

const router = express.Router();

router.post('/verify-captcha', verifyCaptchaController);

export default router;
