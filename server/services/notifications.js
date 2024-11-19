import db from '../config/database'
import dotenv from 'dotenv'
dotenv.config();

class Notification{
    async getAlerts(){
        db.await("Select * from Notifications");
    }
    async createAlert(data){
        const {type, time_stamp, content} = data;
        db.await("insert into Notifications (type, time_stamp, content) values(?, ?, ?)",
            [type, time_stamp, content])           
    }
    async deactivateAlert(){}
    async getAlertsByRoute(){}
}

export default Notification;
