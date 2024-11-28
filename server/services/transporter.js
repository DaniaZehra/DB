import db from '../config/database.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import User from './user.js'
dotenv.config();

class Transporter extends User{
    static async findbyusername(username){
        const [rows] = await db.query('SELECT * from transporter where username = ?', username);
        return rows;
    }
    static async create(first_name,last_name,username,password, email){
        console.log('Password and SaltRounds',password,process.env.SALT_ROUNDS);
        const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS));
        return await db.query('INSERT INTO transporter (first_name, last_name, username, password,email) VALUES (?, ?, ?,?,?)', 
            [first_name, last_name,username, hashedPassword,email]);
    };
    static async saveRefreshToken(userId, refreshToken, type){
        await db.query("DELETE FROM usertoken WHERE user_id = ? AND user_type = ?", [Id, type]);
        await db.query("INSERT INTO usertoken (user_id, user_type, token) VALUES (?, ?, ?)", 
        [Id, type, refreshToken]);
    }
    static async addRoutes(start_stop, end_stop){
        return await db.query('INSERT INTO Routes (start_stop, end_stop) values (?,?,?)',[start_stop, end_stop]);
    }

}
export default Transporter;