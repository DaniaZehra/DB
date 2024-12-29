import express from 'express';
import cors from 'cors';
import {createServer} from 'http';
import {Server} from 'socket.io';
import cookieParser from 'cookie-parser';
import NotificationRoutes from './routes/NotificationRoutes.js';
import authRoutes from './routes/authRoutes.js';
import authMiddleware from './middleware/authmiddleware.js';
import searchRoutes from './routes/searchRoutes.js'
import routeRoutes from './routes/routeRoutes.js';
import vehicleRoutes from './routes/vehicleRoutes.js'
import customerRoutes from './routes/customerRoutes.js';
import captchaRoutes from './routes/captchaRoutes.js'
import TransportRoutes from './routes/transporterRoutes.js';
import adminRoutes from './routes/adminRoutes.js'

import dotenv from 'dotenv';
dotenv.config();


const app = express();
const server = createServer(app);
const io = new Server(server);
app.use(cors({
  origin: 'http://localhost:3000', credentials: true,
  methods: ['GET','POST','PUT']
}))
app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/search',searchRoutes);
app.use('/routes', routeRoutes);
app.use('/api/weather', NotificationRoutes);
app.use('/customer', customerRoutes);
app.use('/transporter',TransportRoutes);
app.use('/admin', adminRoutes);
app.use('/vehicle',vehicleRoutes);
app.use("/alerts", NotificationRoutes);
app.use('/captcha',captchaRoutes)


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
