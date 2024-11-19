import express from 'express';
import {
    getAllAlerts,
    createAlert,
    deactivateAlert,
    getAlertsByRoute
} from '../controllers/NotificationController.js';

const router = express.Router();

router.get('/alerts', getAllAlerts);

router.post('/alerts', createAlert);

router.put('/alerts/:alertId/deactivate', deactivateAlert);

router.get('/alerts/route/:routeId', getAlertsByRoute);

export default router;
