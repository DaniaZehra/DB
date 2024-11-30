import db from '../config/database.js';
import dotenv from 'dotenv';
dotenv.config();

class TransportRoute {
    static async getAllRoutes(transporter_id){
        return await db.query("SELECT * FROM route where transporter_id = ?",[transporter_id]);
    }
    static async createRoute(origin, destination, stops, transporter_id){
        return await db.query("INSERT INTO route (origin, destination, stops, transporter_id) Values(?,?,?,?)",
            [origin, destination, stops, transporter_id]);
    }
    static async deleteRoute(id){
        return await db.query("delete from route where route_id = ?",
            [id]);
    }
    static async updateRouteService(routeData){
        const { route_id, stops, origin, destination, transporter_id } = routeData;
        const query = `UPDATE route SET stops = ?, origin = ?, destination = ?, transporter_id = ? WHERE route_id = ?`;
        const [result] = await db.query(query, [stops, origin, destination, transporter_id, route_id]);
        return result;
    };
}
export default TransportRoute;