import db from '../config/database.js';
import dotenv from 'dotenv';
dotenv.config();

class TransportRoute {
    async getAllRoutes(){
        return await db.query("SELECT * FROM routes");
    }
    async createRoute(data){
        const {origin, destination, distance} = data;
        return await db.query("INSERT INTO routes (origin, destination, distance) Values(?,?,?)",[origin, destination, distance]);
    }
}