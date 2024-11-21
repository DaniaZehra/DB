import axios from 'axios';
import dotenv from 'dotenv'
dotenv.config();

import Notification from './notifications.js';

const weatherService = new Notification();

const API_KEY = process.env.OPENWEATHER_API_KEY;
const CITY = 'Karachi';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

class WeatherApiService {
  static async fetchWeatherData() {
    try {
      const response = await axios.get(`${BASE_URL}?q=${CITY}&appid=${API_KEY}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching weather data:', error.message);
      return null;
    }
  }

  static async checkAndCreateAlert() {
    const weatherData = await this.fetchWeatherData();
    if (!weatherData) return;

    const { weather, main } = weatherData;
    
    if (weather[0].main === 'Rain' && main.temp < 283) {
      await weatherService.createWeatherAlert({
        message: 'Heavy rain and cold weather expected in your area.',
        alertType: 'rain',
        severity: 'high',
        region: CITY
      });
      console.log('Weather alert created and stored in the database.');
    }
  }
}

export default WeatherApiService;
