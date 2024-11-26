import express from 'express';
import {registerCustomer} from '../controllers/customerController.js';
import {registerTransporter} from '../controllers/transporterController.js';
import {login, logout, refreshToken} from '../controllers/authController.js'

const router = express.Router();

router.post('/login', login);
router.post('/register/customer', registerCustomer);
router.post('/register/transporter', registerTransporter);
router.post('/logout', logout);
router.post('/refresh-token', refreshToken);

export default router;