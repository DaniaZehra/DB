import db from '../config/database.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

class User{
    static async saveRefreshToken(userId, user_type, refreshToken) {
        const hashedToken = await bcrypt.hash(refreshToken, 10); // Hash the token
        const expiresAt = new Date(Date.now() + parseInt(process.env.REFRESH_TOKEN_EXPIRATION) * 1000);
        if(user_type==='customer'){
            return await db.query(
                'UPDATE customer_usertoken SET token = ?, expires_at = ? WHERE userId = ?',
                [hashedToken, expiresAt, userId]
            );
        }
        if(user_type==='transporter'){
            return await db.query(
                'UPDATE transporter_usertoken SET token = ?, expires_at = ? WHERE userId = ?',
                [hashedToken, expiresAt, userId]
            );
        }
    }
    static async findRefreshToken(userId) {
        const result = await db.query('SELECT token FROM usertoken WHERE userId = ?', [userId]);
        return result[0]?.token || null; // Return the hashed token
    }    
    static async deleteByToken(refreshToken){
        const result = await db.query('DELETE FROM usertoken WHERE token = ?',[refreshToken]);
        console.log("result of deletion", result);
        return result;
    }
}

export default User;

