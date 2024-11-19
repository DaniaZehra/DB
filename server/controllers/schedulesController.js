import Schedule from './schedule.js';

const scheduleModel = new Schedule();

export const getSchedules = async (req, res) => {
    try {
        const schedules = await scheduleModel.getSchedules();
        res.status(200).json(schedules);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getScheduleByRoute = async (req, res) => {
    try {
        const { route_id } = req.params;
        const schedule = await scheduleModel.getScheduleByRoute(route_id);
        res.status(200).json(schedule);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createSchedule = async (req, res) => {
    try {
        const { schedule_id, vehicle_id, route_id, departure_time, arrival_time, day_of_week, status } = req.body;
        const result = await scheduleModel.createSchedule(schedule_id, vehicle_id, route_id, departure_time, arrival_time, day_of_week, status);
        res.status(201).json({ message: "Schedule created successfully", result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateSchedule = async (req, res) => {
    try {
        const { scheduleId } = req.params;
        const { column, value } = req.body;
        const result = await scheduleModel.updateSchedule(scheduleId, column, value);
        res.status(200).json({ message: "Schedule updated successfully", result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteSchedule = async (req, res) => {
    try {
        const { scheduleId } = req.params;
        const result = await scheduleModel.deleteSchedule(scheduleId);
        res.status(200).json({ message: "Schedule deleted successfully", result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
