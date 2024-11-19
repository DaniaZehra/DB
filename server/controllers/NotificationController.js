import Notification from '../services/notifications.js';

const notificationService = new Notification();

// Fetch all alerts
export const getAllAlerts = async (req, res) => {
    try {
        const alerts = await notificationService.getAlerts();
        res.status(200).json(alerts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create a new alert
export const createAlert = async (req, res) => {
    try {
        const { type, time_stamp, content } = req.body;

        if (!type || !time_stamp || !content) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const response = await notificationService.createAlert(req.body);
        res.status(201).json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Deactivate an alert
export const deactivateAlert = async (req, res) => {
    try {
        const { alertId } = req.params;

        if (!alertId) {
            return res.status(400).json({ error: "Alert ID is required" });
        }

        const response = await notificationService.deactivateAlert(alertId);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get alerts by route
export const getAlertsByRoute = async (req, res) => {
    try {
        const { routeId } = req.params;

        if (!routeId) {
            return res.status(400).json({ error: "Route ID is required" });
        }

        const alerts = await notificationService.getAlertsByRoute(routeId);
        res.status(200).json(alerts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
