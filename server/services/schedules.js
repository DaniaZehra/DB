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
    async createSchedule(data){};
    async updateSchedule(scheduleId, data){};
    async deleteSchedule(scheduleID){};
}
module.exports = schedule;