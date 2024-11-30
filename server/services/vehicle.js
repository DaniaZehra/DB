import db from '../config/database.js';

class Vehicle{
    static async addVehicleService(vehicleData){
        const { vehicle_name, vehicle_number, route_id, transporter_id } = vehicleData;
        const query = `INSERT INTO vehicle (vehicle_name, vehicle_number, route_id, transporter_id) VALUES (?, ?, ?, ?)`;
        const [result] = await db.query(query, [vehicle_name, vehicle_number, route_id, transporter_id]);
        return result;
      };
      
      static async updateVehicleService (vehicleData){
        const { vehicle_id, vehicle_name, vehicle_number, route_id, transporter_id } = vehicleData;
        const query = `UPDATE vehicle SET vehicle_name = ?, vehicle_number = ?, route_id = ?, transporter_id = ? WHERE vehicle_id = ?`;
        const [result] = await db.query(query, [vehicle_name, vehicle_number, route_id, transporter_id, vehicle_id]);
        return result;
      };
}

export default Vehicle;

