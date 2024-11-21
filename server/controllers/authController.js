import Customer from '../services/customer.js';
import Transporter from '../services/transporter.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const login = async (req,res) => {
    const {username, password} = req.body;
    
    if(!username || !password){
        return res.status(400).json({message: 'Username and password are required'});
    }

    try{
        let userType;
        const [user] = (await Customer.findbyusername(username))[0];
        userType = 'customer';

        if(!user||user.length==0){
            let [user] = await Transporter.findbyusername(username);
            userType = 'transporter';
        }
        if(!user||user.length==0){
            return res.status(401).json({message: 'Username not found'});
        }
        console.log(user);
        console.log('Received password:', password);
        console.log('Stored hashed password:', user.hashedPassword);

        const isValidPassword = await bcrypt.compare(password, user.hashedPassword);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        const accessToken = jwt.sign(
            { id: user.id, username: user.username, userType },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRATION }
        );

        const refreshToken = jwt.sign(
            { id: user.id, username: user.username, userType },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION }
        );

        if (userType === 'customer') {
            await Customer.saveRefreshToken(user.cust_id, refreshToken, 'customer');
        } else {
            await Transporter.saveRefreshToken(user.transporter_id, refreshToken,  'transporter');
        }

        res.json({ accessToken, refreshToken, userType });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ error: 'Login failed' });
    }

    }


export const logout = async (req,res) =>{
    const {refreshToken} = req.body;
    if(!refreshToken) return res.staus(403).json({error: 'Refresh token required'});
    try {
        await User.deleteRefreshToken(refreshToken);
        res.status(200).json({message: 'Logout-successful'});
    } catch (err) {
        res.status(500).json({error: 'Logout failed'});
    }
}