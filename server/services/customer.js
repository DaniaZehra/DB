import db from '../config/database.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import {User} from './user.js'
dotenv.config();

class Customer extends User{
    static async create(id,username, password,email){
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return await db.query('INSERT INTO customers (id,username, password,email) VALUES (?, ?, ?, ?)', [id,username, hashedPassword,email]);
    };
    static async BookCourier(customer_id, courier_name){
        return await db.query('INSERT INTO couriers (customer_id, courier_name) values (?,?)',[customer_id, courier_name]);
    }
}

export default Customer