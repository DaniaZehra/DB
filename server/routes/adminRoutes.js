import express from 'express';
import { adminSignin, deleteAdmin, createNewAdmin, 
    getAdminActivity, updateAdminDetails } from '../controllers/adminController.js';

const router = express.Router();

router.post('/signin', adminSignin);
router.put('/update', updateAdminDetails);
router.delete('/delete', deleteAdmin);
router.put('/create',createNewAdmin);
router.get('/activity', getAdminActivity);

export default router;
