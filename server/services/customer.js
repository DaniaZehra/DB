import db from '../config/database.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import User from './user.js'
dotenv.config();

class Customer extends User{
    static async findbyusername(username){
        const rows = await db.query('SELECT * from customer where username = ?', username);
        return rows;
    }
    static async create(id, username, first_name, last_name, phone_number, password,email){
        const saltRounds = parseInt(process.env.SALT_ROUNDS);
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return await db.query('INSERT INTO customer (cust_id,username,first_name, last_name, phone_number, hashedPassword,cust_email) VALUES (?, ?, ?, ?,?,?,?)', 
            [id,username,first_name,last_name,phone_number, hashedPassword,email]);
    };
    static async saveRefreshToken(Id, refreshToken, type){
        await db.query("replace into usertoken (user_id, user_type, token) values (?,?,?)",
            [Id, type, refreshToken]
        );
    }
    static async BookCourier(customer_id, courier_name){
        return await db.query('INSERT INTO couriers (customer_id, courier_name) values (?,?)',[customer_id, courier_name]);
    }
    

}

export default Customer;