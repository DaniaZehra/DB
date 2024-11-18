import db from '../config/database.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import {User} from './user.js'
dotenv.config();

class Transporter extends User{
    static async create(id,username, password,email){
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return await db.query('INSERT INTO transporters (id,username, password,email) VALUES (?, ?, ?, ?)', [id,username, hashedPassword,email]);
    };
    static async addRoutes(start_stop, end_stop){
        return await db.query('INSERT INTO Routes (start_stop, end_stop) values (?,?,?)',[start_stop, end_stop]);
    }

}
export default Transporter