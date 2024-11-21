import db from '../config/database.js';
import dotenv from 'dotenv';
dotenv.config();

class Notification {
    // Fetch all alerts
    async getAlerts() {
        try {
            const alerts = await db.query("SELECT * FROM Notifications");
            if(!alerts || alerts.length==0){
                throw new Error('no alerts');
            }
            return alerts;
        } catch (error) {
            throw new Error(`Error fetching alerts: ${error.message}`);
        }
    }

    // Create a new alert
    async createAlert(data) {
        const { type, time_stamp, content } = data;
        try {
            await db.awaitQuery(
                "INSERT INTO Notifications (type, time_stamp, content) VALUES (?, ?, ?)",
                [type, time_stamp, content]
            );
            return { message: "Alert created successfully" };
        } catch (error) {
            throw new Error(`Error creating alert: ${error.message}`);
        }
    }

    // Deactivate an alert
    async deactivateAlert(alertId) {
        try {
            await db.awaitQuery(
                "UPDATE Notifications SET active = 0 WHERE id = ?",
                [alertId]
            );
            return { message: "Alert deactivated successfully" };
        } catch (error) {
            throw new Error(`Error deactivating alert: ${error.message}`);
        }
    }

    // Get alerts filtered by route
    async getAlertsByRoute(routeId) {
        try {
            const alerts = await db.awaitQuery(
                "SELECT * FROM Notifications WHERE route_id = ? AND active = 1",
                [routeId]
            );
            return alerts;
        } catch (error) {
            throw new Error(`Error fetching alerts by route: ${error.message}`);
        }
    }
}

export default Notification;
