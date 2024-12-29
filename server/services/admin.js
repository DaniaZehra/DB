import { resourceLimits } from 'worker_threads';
import db from '../config/database.js';
import crypto from 'crypto';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
dotenv.config();


export default class Admin {
    static async createAdmin(username, password) {
        try {
            // Check if the username already exists
            const checkUserQuery = `SELECT admin_id FROM admin WHERE username = ?`;
            const [existingUser] = await db.query(checkUserQuery, [username]);

            if (existingUser.length > 0) {
                throw new Error('Username already exists.');
            }

            // Hash the password using SHA-256
            const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

            // Insert new admin into the database
            const insertAdminQuery = `
                INSERT INTO admin (username, password_hash)
                VALUES (?, ?)
            `;
            const [result] = await db.query(insertAdminQuery, [username, hashedPassword]);

            if (result.affectedRows === 1) {
                return { success: true, message: 'Admin created successfully', adminId: result.insertId };
            } else {
                throw new Error('Failed to create admin.');
            }
        } catch (error) {
            console.error('Error creating admin:', error.message);
            throw error;
        }
    }
    static async adminSignin(username, password) {
        try {
            const query = `
                SELECT admin_id, password_hash
                FROM admin
                WHERE username = ?
            `;
            const [result] = await db.query(query, [username]);

            if (result.length === 0) {
                throw new Error('Username does not exist.');
            }

            const { password_hash, admin_id } = result[0];
            const enteredHash = crypto.createHash('sha256').update(password).digest('hex');

            if (enteredHash !== password_hash) {
                throw new Error('Incorrect password.');
            }

            return { success: true, message: 'Sign-in successful', adminId: admin_id };
        } catch (error) {
            console.error('Error during admin sign-in:', error.message);
            throw error;
        }
    }

    static async updateAdminDetails(username, updates) {
        try {
            await db.query('START TRANSACTION');

            const fieldMap = { 'Username': 'username', 'Password': 'password' };
            const updateKeys = Object.keys(updates).filter(key => fieldMap[key]);

            if (updateKeys.length === 0) {
                throw new Error('No valid fields to update.');
            }

            const fetchAdminIdQuery = `SELECT admin_id FROM admin WHERE username = ?`;
            const [result] = await db.query(fetchAdminIdQuery, [username]);

            if (result.length === 0) {
                throw new Error('Admin not found.');
            }

            const adminId = result[0].admin_id;

            for (const key of updateKeys) {
                const dbColumn = fieldMap[key];
                if (dbColumn === 'password') {
                    const hashedPassword = crypto.createHash('sha256').update(updates[key]).digest('hex');
                    const updatePasswordQuery = `UPDATE admin SET password_hash = ? WHERE admin_id = ?`;
                    await db.query(updatePasswordQuery, [hashedPassword, adminId]);
                } else {
                    const updateFieldQuery = `UPDATE admin SET ${dbColumn} = ? WHERE admin_id = ?`;
                    await db.query(updateFieldQuery, [updates[key], adminId]);
                }
            }

            await db.query('COMMIT');
            return { success: true, message: 'Admin details updated successfully' };
        } catch (error) {
            console.error('Error updating admin details:', error.message);
            await db.query('ROLLBACK');
            throw error;
        }
    }

    static async getAdminActivity(){
        try{
            const [result] = await db.query('select * from admin_activity_log');
            return result; 
        }catch(error){
            console.error(error.message);
            throw error;
        }
    }

    // static async generateOTP() {
    //     return Math.floor(100000 + Math.random() * 900000).toString();
    // }

    // static async sendOTPEmail(email, otp){
    //     console.log('Email User:', process.env.EMAIL_USER);
    //     console.log('Email Pass:', process.env.EMAIL_PASS);

    //     const transporter = nodemailer.createTransport({
    //         service: 'gmail',
    //         auth: {
    //             user: process.env.EMAIL_USER,
    //             pass: process.env.EMAIL_PASS,
    //         }
    //     })

    //     transporter.verify((error, success) => {
    //         if (error) {
    //             console.error('Transporter configuration error:', error);
    //         } else {
    //             console.log('Transporter is ready to send emails');
    //         }
    //     });

    //     const mailOptions = {
    //         from: process.env.EMAIL_USER,
    //         to: email,
    //         subject: 'OTP Code',
    //         text: `OTP code: ${otp} It will expire in 5 minutes`
    //     };

    //     await transporter.sendMail(mailOptions);
        
    // }

    static async deleteAdmin(adminUsername) {
        try {
            await db.query('START TRANSACTION');
            const deleteAdminQuery = `DELETE FROM admin WHERE username = ?`;
            const [result] = await db.query(deleteAdminQuery, [adminUsername]);

            if (result.affectedRows === 0) {
                throw new Error('Admin not found.');
            }

            await db.query('COMMIT');
            return { success: true, message: 'Admin account deleted.' };
        } catch (error) {
            console.error('Error deleting admin:', error.message);
            await db.query('ROLLBACK');
            throw error;
        }
    }
}
