import db from '../config/database.js';
import dotenv from 'dotenv';
dotenv.config();

class User{
    static findbyUsername(username){
        return db.query('Select * from customers where username = ?', [username]);
    }
    static async saveRefreshToken(userId, refreshToken){
        return await db.query('UPDATE usertoken SET token = ? WHERE userId = ?', [refreshToken, userId]);
    }
    static async findRefreshToken(userId){
        return await db.query('SELECT token FROM usertoken WHERE userId = ?',[userId]);
    }
    static async deleteByToken(refreshToken){
        const result = await db.query('DELETE FROM usertoken WHERE token = ?',[refreshToken]);
        console.log("result of deletion", result);
        return result;
    }
}

export default User;

