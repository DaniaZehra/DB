import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const register = async (req,res) => {
    const {id, username, password,email} = req.body;
    if(!username && !password){
        return res.status(400).json({message: 'Username and password are required'});
    }
    try {
        await User.create(id, username, password,email);
        res.status(201).json({message: 'User created successfully'});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Internal server error'});
    }
}

export const login = async (req,res) => {
    const {username, password} = req.body;
    try {
        const [user] =await User.findbyUsername(username);
        if(user.length ===0) return res.status(401).json({message: 'Invalid username or password'});
        const isValidPassword = await bcypt.compare(password,user[0].password);
        if(!isValidPassword) return res.statues(401).json({message: 'Invalid username or password'});
 
        const accessToken = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRATION,
        });
        const refreshToken = jwt.sign({ id: user.id, username: user.username }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRATION,
        });
  
        await User.saveRefreshToken(user.id, refreshToken);
  
        res.json({ accessToken, refreshToken });
    } catch (err) {
        res.status(500).json({ error: 'Login failed' });
    }
}

export const refreshToken = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(403).json({ error: 'Refresh token required' });
  
    try {
      const rt = await User.findRefreshToken(refreshToken);
      if (!rt) return res.status(403).json({ error: 'Invalid refresh token' });

      const isExpired = new Date(rt.expires_at) < new Date();
      if (isExpired) {
          await rt.deleteByToken(refreshToken);
          return res.status(403).json({ error: 'Refresh token expired' });
      }
  
      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
        if (err) return res.status(403).json({ error: 'Invalid refresh token' });

    const accessToken = jwt.sign(
            { id: decoded.id, username: decoded.username },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRATION }
          );
    
          res.json({ accessToken });
    });

    } catch (err) {
        res.status(500).json({ error: 'Could not refresh token' });
    }
  };

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