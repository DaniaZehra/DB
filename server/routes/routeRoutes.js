import express from 'express'
import { createRoutes, getAllRoutes, deleteRoute, updateRoute } from '../controllers/routeController.js';

const router = express.Router();
router.put('/add',createRoutes);
router.post('/update', updateRoute);
router.get('/get',getAllRoutes);
router.post('/delete',deleteRoute);

export default router
