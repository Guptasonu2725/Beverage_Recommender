const axios = require('axios');

/**
 * Get weather data using OpenMeteo API (Free, no API key needed)
 * @param {number} latitude 
 * @param {number} longitude 
 * @returns {Promise<Object>} Weather data
 */
const getWeatherByLocation = async (latitude, longitude) => {
  try {
    console.log('🌐 Calling OpenMeteo API for weather...');
    
    // OpenMeteo API URL
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code&timezone=auto`;
    
    const response = await axios.get(weatherUrl);
    const data = response.data;
    
    const temperature = Math.round(data.current.temperature_2m);
    const humidity = data.current.relative_humidity_2m;
    const weatherCode = data.current.weather_code;
    
    // Map OpenMeteo weather codes to our categories
    const weather = mapWeatherCode(weatherCode, temperature);
    const description = getWeatherDescription(weatherCode);
    
    // Hardcoded location as Jodhpur, IN (no reverse geocoding needed)
    console.log('✅ OpenMeteo weather retrieved:', { 
      weather, 
      temperature, 
      humidity, 
      location: 'Jodhpur' 
    });
    
    return {
      weather,
      temperature,
      humidity,
      location: 'Jodhpur',
      country: 'IN',
      description,
      weatherCode
    };
  } catch (error) {
    console.error('❌ Error fetching weather from OpenMeteo:', error.message);
    
    // Return Jodhpur defaults if API fails
    return {
      weather: 'Sunny',
      temperature: 24,
      humidity: 60,
      location: 'Jodhpur',
      country: 'IN',
      description: ''
    };
  }
};

/**
 * Map OpenMeteo weather codes to our categories
 * Reference: https://open-meteo.com/en/docs
 */
const mapWeatherCode = (code, temperature) => {
  // Weather code mapping
  const weatherMap = {
    0: temperature > 30 ? 'Hot' : 'Sunny',        // Clear sky
    1: temperature > 30 ? 'Hot' : 'Sunny',        // Mainly clear
    2: 'Cloudy',                                   // Partly cloudy
    3: 'Cloudy',                                   // Overcast
    45: 'Foggy',                                   // Fog
    48: 'Foggy',                                   // Depositing rime fog
    51: 'Rainy',                                   // Drizzle: Light
    53: 'Rainy',                                   // Drizzle: Moderate
    55: 'Rainy',                                   // Drizzle: Dense
    56: 'Rainy',                                   // Freezing Drizzle: Light
    57: 'Rainy',                                   // Freezing Drizzle: Dense
    61: 'Rainy',                                   // Rain: Slight
    63: 'Rainy',                                   // Rain: Moderate
    65: 'Rainy',                                   // Rain: Heavy
    66: 'Rainy',                                   // Freezing Rain: Light
    67: 'Rainy',                                   // Freezing Rain: Heavy
    71: 'Snowy',                                   // Snow fall: Slight
    73: 'Snowy',                                   // Snow fall: Moderate
    75: 'Snowy',                                   // Snow fall: Heavy
    77: 'Snowy',                                   // Snow grains
    80: 'Rainy',                                   // Rain showers: Slight
    81: 'Rainy',                                   // Rain showers: Moderate
    82: 'Rainy',                                   // Rain showers: Violent
    85: 'Snowy',                                   // Snow showers: Slight
    86: 'Snowy',                                   // Snow showers: Heavy
    95: 'Stormy',                                  // Thunderstorm: Slight or moderate
    96: 'Stormy',                                  // Thunderstorm with slight hail
    99: 'Stormy'                                   // Thunderstorm with heavy hail
  };
  
  const weather = weatherMap[code] || 'Sunny';
  
  // Additional temperature-based classification
  if (temperature > 35 && (code === 0 || code === 1)) {
    return 'Hot';
  } else if (temperature < 10) {
    return 'Cold';
  }
  
  return weather;
};

/**
 * Get human-readable weather description
 */
const getWeatherDescription = (code) => {
  const descriptions = {
    0: 'clear sky',
    1: 'mainly clear',
    2: 'partly cloudy',
    3: 'overcast',
    45: 'foggy',
    48: 'foggy with rime',
    51: 'light drizzle',
    53: 'moderate drizzle',
    55: 'dense drizzle',
    61: 'slight rain',
    63: 'moderate rain',
    65: 'heavy rain',
    71: 'slight snow',
    73: 'moderate snow',
    75: 'heavy snow',
    80: 'rain showers',
    81: 'moderate rain showers',
    82: 'violent rain showers',
    95: 'thunderstorm',
    96: 'thunderstorm with hail',
    99: 'severe thunderstorm'
  };
  
  return descriptions[code] || '';
};

module.exports = {
  getWeatherByLocation
};
