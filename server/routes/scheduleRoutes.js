import express from 'express';
import {
    getSchedules,
    getScheduleByRoute,
    createSchedule,
    updateSchedule,
    deleteSchedule
} from './scheduleController.js';

const router = express.Router();

router.get('/schedules', getSchedules);
router.get('/schedules/:route_id', getScheduleByRoute);
router.post('/schedules', createSchedule);
router.put('/schedules/:scheduleId', updateSchedule);
router.delete('/schedules/:scheduleId', deleteSchedule);

export default router;
