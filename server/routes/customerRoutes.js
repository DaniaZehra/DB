import express from 'express';
import { viewRoutes, getTrafficUpdates, estimateFare, updateCustomerDetails, 
    deleteCustomer, bookRide, getLoyaltyPoints, fetchBookings, fetchCustomerDetails, fetchCurrentBookings,
     submitFeedback} from '../controllers/customerController.js';

const router = express.Router();

// Routes
router.get('/routes', viewRoutes);
router.post('/traffic-updates',getTrafficUpdates);
router.post('/estimate-fare', estimateFare);
router.put('/update/:custId', updateCustomerDetails);
router.put('/fetch-details',fetchCustomerDetails);
router.delete('/delete/:custId',deleteCustomer);
router.put('/fetch-bookings',fetchBookings);
router.put('/fetch-curr-bookings',fetchCurrentBookings)
router.put('/bookRide',bookRide);
router.put('/loyalty-points',getLoyaltyPoints);
router.post('/submit-feedback', submitFeedback);


export default router;
