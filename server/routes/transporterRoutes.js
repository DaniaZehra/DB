import express from 'express'
import { Retrieve, getAnalytics } from '../controllers/transporterController.js';

const router = express.Router();
router.put('/get',Retrieve);
router.put('/analytics', getAnalytics)
export default router;
