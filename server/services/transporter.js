import db from '../config/database.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import User from './user.js'
import { labelDayButton } from 'react-day-picker';
dotenv.config();

class Transporter extends User{
    static async findbyusername(username){
        const [rows] = await db.query('SELECT * from transporter where username = ?', username);
        return rows;
    }
    static async findbyEmail(email){
        const [rows] = await db.query('SELECT * from transporter where email = ?', username);
        return rows;
    }
    static async create(first_name,last_name,username,password, email){
        console.log('Password and SaltRounds',password,process.env.SALT_ROUNDS);
        const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS));
        return await db.query('INSERT INTO transporter (first_name, last_name, username, hashedPassword,email) VALUES (?, ?, ?,?,?)', 
            [first_name, last_name,username, hashedPassword,email]);
    };
    static async saveRefreshToken(userId, refreshToken){
        await db.query("DELETE FROM transporter_usertoken WHERE user_id = ?", [userId]);
        await db.query("INSERT INTO transporter_usertoken (user_id, token) VALUES (?, ?)", 
        [userId, refreshToken]);
    }
    static async addRoutes(start_stop, end_stop){
        return await db.query('INSERT INTO Routes (start_stop, end_stop) values (?,?,?)',[start_stop, end_stop]);
    }
    static async searchIdbyEmail(email){
        return await db.query('select transporter_id from transporter where email = ?',[email]);
    }
    static async retrieve(table_name, userId) {
        const sql = `SELECT * FROM ${table_name} WHERE transporter_id = ?`;
        return await db.query(sql, [userId]);
    }
    static async delete(table_name, userId) {
        const sql = `delete FROM ${table_name} WHERE transporter_id = ?`;
        return await db.query(sql, [userId]);
    }
    static async viewAnalytics(transporterId) {
        const query = `
            SELECT 
                t.transporter_id,
                IFNULL(SUM(b.price), 0) AS profit,  -- Sum of prices for profit
                IFNULL(AVG(f.rating), 0) AS average_rating,  -- Average rating
                IFNULL(SUM(b.price), 0) AS total_revenue  -- Total revenue (same as profit in this case)
            FROM 
                transporter t
            LEFT JOIN 
                bookings b ON b.transporter_id = t.transporter_id
            LEFT JOIN 
                feedback f ON f.feedback_id = b.booking_id  -- Correct join using booking_id
            WHERE 
                t.transporter_id = ? 
            GROUP BY 
                t.transporter_id;
        `;

        try {
            // Execute the query using the client database connection
            const [result] = await db.query(query, [transporterId]);
            console.log(result);

            if (result.length === 0) {
                console.log('No analytics data found for the given transporter.');
                return null;  // Return null if no data found
            }

            // Return the calculated analytics data
            return result[0];
        } catch (err) {
            console.error('Error retrieving analytics data:', err.message);
            throw new Error('Error retrieving analytics data');
        } 
    }
    

}
export default Transporter;