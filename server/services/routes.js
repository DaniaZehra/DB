import db from '../config/database.js';
import dotenv from 'dotenv';
dotenv.config();

class TransportRoute {
    static async getAllRoutes(transporter_id){
        return await db.query("SELECT * FROM route where transporter_id = ?",[transporter_id]);
    }
    static async createRoute(origin, destination, stops, transporter_id){;
        return await db.query("INSERT INTO route (origin, destination, stops, transporter_id) Values(?,?,?,?)",
            [origin, destination, stops, transporter_id]);
    }
}
export default TransportRoute;