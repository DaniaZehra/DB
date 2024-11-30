import express from 'express';
import { addVehicle, updateVehicle } from '../controllers/vehicleController.js';

const router = express.Router();

router.put('/add', addVehicle);
router.post('/update', updateVehicle);

export default router;
