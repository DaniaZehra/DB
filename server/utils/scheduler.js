import WeatherApiService from '../services/notificationsWeather.js';

function startWeatherAlertScheduler() {
  setInterval(async () => {
    await WeatherApiService.checkAndCreateAlert();
  }, 3600000);
}

export default startWeatherAlertScheduler;
