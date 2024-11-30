import express from 'express';
import { adminSignin, updateAdminDetails, deleteAdmin } from '../controllers/adminController.js';

const router = express.Router();

router.post('/signin', adminSignin);
router.put('/update', updateAdminDetails);
router.delete('/delete', deleteAdmin);

export default router;
