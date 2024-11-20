import express from 'express'
import { createRoutes, getAllRoutes } from '../controllers/routeController.js';

const router = express.Router();
router.post('/create',createRoutes);
router.get('/get',getAllRoutes);

export default router
