const axios = require('axios');
require('dotenv').config();

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

/**
 * Map OpenWeatherMap conditions to our model's weather types
 */
const mapWeatherCondition = (weatherMain, temp) => {
  const weatherMap = {
    'Clear': temp > 30 ? 'Hot' : 'Sunny',
    'Clouds': 'Cloudy',
    'Rain': 'Rainy',
    'Drizzle': 'Rainy',
    'Thunderstorm': 'Stormy',
    'Snow': 'Snowy',
    'Mist': 'Foggy',
    'Smoke': 'Foggy',
    'Haze': 'Foggy',
    'Dust': 'Windy',
    'Fog': 'Foggy',
    'Sand': 'Windy',
    'Ash': 'Cloudy',
    'Squall': 'Windy',
    'Tornado': 'Stormy'
  };

  // Additional temperature-based classification
  if (temp < 10) {
    return 'Cold';
  }

  return weatherMap[weatherMain] || 'Sunny';
};

/**
 * Fetch weather data from OpenWeatherMap API
 * @param {number} latitude 
 * @param {number} longitude 
 * @returns {Promise<Object>} Weather data
 */
const getWeatherByLocation = async (latitude, longitude) => {
  try {
    if (!OPENWEATHER_API_KEY || OPENWEATHER_API_KEY === 'your_api_key_here') {
      console.warn('⚠️  OpenWeatherMap API key not configured. Using default values.');
      return {
        weather: process.env.DEFAULT_WEATHER || 'Sunny',
        temperature: parseFloat(process.env.DEFAULT_TEMPERATURE) || 24,
        humidity: parseFloat(process.env.DEFAULT_HUMIDITY) || 60,
        location: 'Jodhpur',
        country: 'IN',
        description: ''
      };
    }

    const url = `${OPENWEATHER_BASE_URL}?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}&units=metric`;
    
    console.log('🌐 Calling OpenWeatherMap API...');
    const response = await axios.get(url);

    const data = response.data;
    const temperature = Math.round(data.main.temp);
    const humidity = data.main.humidity;
    const weatherMain = data.weather[0].main;
    const weatherDescription = data.weather[0].description;
    
    // Map to our model's weather categories
    const mappedWeather = mapWeatherCondition(weatherMain, temperature);

    return {
      weather: mappedWeather,
      temperature,
      humidity,
      location: data.name,
      country: data.sys.country,
      description: weatherDescription,
      rawWeather: weatherMain
    };
  } catch (error) {
    console.error('❌ Error fetching weather data:', error.message);
    
    // Return default values if API fails
    return {
      weather: process.env.DEFAULT_WEATHER || 'Sunny',
      temperature: parseFloat(process.env.DEFAULT_TEMPERATURE) || 24,
      humidity: parseFloat(process.env.DEFAULT_HUMIDITY) || 60,
      location: 'Jodhpur',
      country: 'IN',
      description: ''
    };
  }
};

module.exports = {
  getWeatherByLocation
};
