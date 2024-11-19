import express from 'express';
import authRoutes from './routes/authRoutes.js';
import authMiddleware from './middleware/authmiddleware.js';
import searchRoutes from './routes/searchRoutes.js'
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/search',searchRoutes);

app.get('/protected', authMiddleware, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
