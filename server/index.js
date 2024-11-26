import express from 'express';
import cors from 'cors';
import {createServer} from 'http';
import {Server} from 'socket.io';
import cookieParser from 'cookie-parser';
import NotificationRoutes from './routes/NotificationRoutes.js';
import startWeatherAlertScheduler from './utils/scheduler.js';
import authRoutes from './routes/authRoutes.js';
import authMiddleware from './middleware/authmiddleware.js';
import searchRoutes from './routes/searchRoutes.js'
import routeRoutes from './routes/routeRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import WeatherApiService from './services/notificationsWeather.js';

import dotenv from 'dotenv';
dotenv.config();

WeatherApiService.checkAndCreateAlert = async () => {
  console.log('Weather Alert Service Called');
};

// // Test function
// async function testStartWeatherAlertScheduler() {
//   console.log('Starting Scheduler Test...');
//   startWeatherAlertScheduler();

//   // Allow some time for the scheduler to trigger the service
//   await new Promise((resolve) => setTimeout(resolve, 2000));

//   console.log('If you see "Weather Alert Service Called" in the output, the test passed.');
// }

// testStartWeatherAlertScheduler();

const app = express();
const server = createServer(app);
const io = new Server(server);
app.use(cors({
  origin: 'http://localhost:3000'
}))
app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/search',searchRoutes);
app.use('/routes', routeRoutes);
app.use('/api/weather', NotificationRoutes);
app.use('/customer', customerRoutes);

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


const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
