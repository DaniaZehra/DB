import express from 'express';
import { viewRoutes, getTrafficUpdates, estimateFare, updateCustomerDetails, deleteCustomer, bookRide, getLoyaltyPoints} from '../controllers/customerController.js';

const router = express.Router();

// Routes
router.get('/routes', viewRoutes);
router.post('/traffic-updates',getTrafficUpdates);
router.post('/estimate-fare', estimateFare);
router.put('/update/:custId', updateCustomerDetails);
router.delete('/delete/:custId',deleteCustomer);
router.put('/bookRide',bookRide);
router.put('/loyalty-points',getLoyaltyPoints);

export default router;
