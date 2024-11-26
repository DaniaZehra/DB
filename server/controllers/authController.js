import Customer from '../services/customer.js';
import Transporter from '../services/transporter.js';
import User from '../services/user.js'
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
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            maxAge: parseInt(process.env.JWT_EXPIRATION) * 1000, // Expiry in ms
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            maxAge: parseInt(process.env.REFRESH_TOKEN_EXPIRATION) * 1000, // Expiry in ms
        });

        res.json({ userType, accessToken, refreshToken });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ error: 'Login failed' });
    }

    }


export const logout = async (req,res) =>{
    const {refreshToken} = req.body;
    if(!refreshToken) return res.status(403).json({error: 'Refresh token required'});

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    if (!decoded) { return res.status(401).json({ message: 'Invalid refresh token' });}

    res.clearCookie('accessToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
    });
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
    });
    try {
        await User.deleteByToken(refreshToken);
        res.status(200).json({message: 'Logout-successful'});
    } catch (err) {
        console.log('Error deleting token', err);
        res.status(500).json({error: 'Logout failed'});
    }
}

export const refreshToken = async (req, res) => {
    const { refreshToken } = req.cookies; 

    if (!refreshToken) {
        return res.status(403).json({ error: 'Refresh token required' });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        const accessToken = jwt.sign(
            { id: decoded.id, username: decoded.username, userType: decoded.userType },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRATION }
        );

        const newRefreshToken = jwt.sign(
            { id: decoded.id, username: decoded.username, userType: decoded.userType },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION }
        );

        await User.saveRefreshToken(decoded.id, newRefreshToken);

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: parseInt(process.env.JWT_EXPIRATION) * 1000,
        });
        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: parseInt(process.env.REFRESH_TOKEN_EXPIRATION) * 1000,
        });

        res.status(200).json({ message: 'Token refreshed successfully' });
    } catch (err) {
        console.error('Error during token refresh:', err);
        res.status(500).json({ error: 'Token refresh failed' });
    }
};