import db from './config/database.js';
import dotenv from 'dotenv'
db = dotenv.config()

class schedule{
    async getSchedules(){
        db.await("Select * from Schedules");
    }
    async getScheduleByRoute(data){
        db.await("Select * from Schedules where route_id = ?",data);
    }
    async createSchedule(data){
        const {schedule_id, vehicle_id, route_id, departure_time, arrival_time, day_of_week,status} = data;
        db.await("Insert into schedules (schedule_id, vehicle_id, route_id, departure_time, arrival_time, day_of_week, status) values (?,?,?,?,?,?,?)",
            [schedule_id, vehicle_id, route_id, departure_time, arrival_time, day_of_week, status]);
    };
    async updateSchedule(scheduleId, data, i){
        db.awaait("Update schedules set ? = ? where schedule_id = ?",[i,data,scheduleId]);
    };
    async deleteSchedule(scheduleID){
        db.await("Delete from schedules where schedule_id = ?",scheduleID);
    };
}
module.exports = schedule;