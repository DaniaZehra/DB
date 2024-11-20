import db from './config/database.js';

class Schedule {
    async getSchedules() {
        const [rows] = await db.query("SELECT * FROM schedules");
        return rows;
    }

    async getScheduleByRoute(route_id) {
        const [rows] = await db.query("SELECT * FROM schedules WHERE route_id = ?", [route_id]);
        return rows;
    }

    async createSchedule(schedule_id, vehicle_id, route_id, departure_time, arrival_time, day_of_week, status) {
        const result = await db.query(
            "INSERT INTO schedules (schedule_id, vehicle_id, route_id, departure_time, arrival_time, day_of_week, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [schedule_id, vehicle_id, route_id, departure_time, arrival_time, day_of_week, status]
        );
        return result;
    }

    async updateSchedule(scheduleId, column, value) {
        const query = `UPDATE schedules SET ${column} = ? WHERE schedule_id = ?`;
        const result = await db.query(query, [value, scheduleId]);
        return result;
    }

    async deleteSchedule(scheduleID) {
        const result = await db.query("DELETE FROM schedules WHERE schedule_id = ?", [scheduleID]);
        return result;
    }
}

export default Schedule;
