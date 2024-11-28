import Customer from '../services/customer.js';
import Transporter from '../services/transporter.js';
import User from '../services/user.js'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        let user;
        let userType;
        let userId;

        console.log('What is happening');
        // Check in Customer table
        const customerResult = await Customer.findbyusername(username);
        if (customerResult.length > 0) {
            user = customerResult[0];
            userType = 'customer';
            userId = user.cust_id;
        } else {
            // Check in Transporter table
            const transporterResult = await Transporter.findbyusername(username);
            if (transporterResult.length > 0) {
                user = transporterResult[0];
                userType = 'transporter';
                userId = user.transporter_id;
            } else {
                return res.status(401).json({ message: 'Username not found' });
            }
        }

        const isValidPassword = await bcrypt.compare(password, user.hashedPassword);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Create JWTs
        const payload = { id: userId, username: user.username, userType };
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRATION,
        });

        const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRATION,
        });

        // Save refresh token to DB
        if (userType === 'customer') {
            await Customer.saveRefreshToken(userId, refreshToken, 'customer');
        } else {
            await Transporter.saveRefreshToken(userId, refreshToken, 'transporter');
        }

        // Set cookies
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Set `false` for development
            sameSite: 'None',
        };

        res.cookie('accessToken', accessToken, {
            ...cookieOptions,
            maxAge: parseInt(process.env.JWT_EXPIRATION) * 1000, // Expiry in ms
        });

        res.cookie('refreshToken', refreshToken, {
            ...cookieOptions,
            maxAge: parseInt(process.env.REFRESH_TOKEN_EXPIRATION) * 1000, // Expiry in ms
        });

        res.cookie('userType', userType, { httpOnly: false });
        res.cookie('userId', userId, { httpOnly: false });

        res.status(200).json({ message: 'Login Successful' });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ error: 'Login failed' });
    }
};



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
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        if (!decoded) {
            return res.status(401).json({ message: 'Invalid refresh token' });
        }
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
        const savedToken = await User.findRefreshToken(decoded.id);
        if (!savedToken || !(await bcrypt.compare(refreshToken, savedToken))) {
            return res.status(401).json({ error: 'Invalid or expired refresh token' });
        }
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

        await db.beginTransaction();
        try {
            await User.saveRefreshToken(decoded.id, newRefreshToken);
            await User.deleteByToken(refreshToken);
            await db.commit();
        } catch (err) {
            await db.rollback();
            throw err;
        }


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