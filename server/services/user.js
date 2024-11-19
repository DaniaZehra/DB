import db from '../config/database.js';
import dotenv from 'dotenv';
dotenv.config();

class User{
    static findbyUsername(username){
        return db.query('Select * from customers where username = ?', [username]);
    }
    static async saveRefreshToken(userId, refreshToken){
        return await db.query('UPDATE refresh_tokens SET token = ? WHERE userId = ?', [refreshToken, userId]);
    }
    static async findRefreshToken(userId){
        return await db.query('SELECT token FROM refresh_tokens WHERE userId = ?',[userId]);
    }
    static async deleteByToken(refreshToken){
        return await db.query('DELETE FROM refresh_tokens WHERE token = ?',[refreshToken]);
    }
}

export default User;

