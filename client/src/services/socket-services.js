// client/src/services/socketService.js
import { io } from 'socket.io-client';

const socket = io('http://localhost:4000'); // Replace with your server URL

// Event listener for weather alerts
export const listenForWeatherAlerts = (callback) => {
  socket.on('weather-alert', (alertData) => {
    callback(alertData);
  });
};

export default socket;
