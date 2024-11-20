import express from 'express';
import {createServer} from 'http';
import {Server} from 'socket.io';
import NotificationRoutes from './routes/NotificationRoutes.js';
import startWeatherAlertScheduler from './utils/scheduler.js';
import authRoutes from './routes/authRoutes.js';
import authMiddleware from './middleware/authmiddleware.js';
import searchRoutes from './routes/searchRoutes.js'
import routeRoutes from './routes/routeRoutes.js';

import dotenv from 'dotenv';
dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server);
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/search',searchRoutes);
app.use('/routes', routeRoutes);
app.use('/api/weather', NotificationRoutes);

startWeatherAlertScheduler();

io.on('connection', (socket) => {
  console.log('User connected');
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

app.get('/protected', authMiddleware, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
