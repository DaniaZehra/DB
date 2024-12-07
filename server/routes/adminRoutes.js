import express from 'express';
import { adminSignin, updateAdminDetails, deleteAdmin, createNewAdmin } from '../controllers/adminController.js';

const router = express.Router();

router.post('/signin', adminSignin);
router.put('/update', updateAdminDetails);
router.delete('/delete', deleteAdmin);
router.put('/create',createNewAdmin);

export default router;
