const { predictBeverage } = require('../services/pythonService');
const { getWeatherByLocation } = require('../services/weatherService');
const { addFeedback, getFeedbackStats, getFeedbackPatterns } = require('../services/feedbackService');
const { getCurrentTimeOfDay, generateReason } = require('../utils/helpers');

/**
 * Recommend beverage based on manual input
 */
const recommendBeverage = async (req, res, next) => {
  try {
    const { weather, mood, temperature, humidity } = req.body;

    console.log('📥 Received recommendation request:', { weather, mood, temperature, humidity });

    // Get current time of day
    const timeOfDay = getCurrentTimeOfDay();

    // Call Python ML model
    const prediction = await predictBeverage({
      weather,
      mood,
      temperature: parseFloat(temperature),
      humidity: parseFloat(humidity)
    });

    // Generate reason for recommendation
    const reason = generateReason(prediction, weather, mood, temperature, timeOfDay);

    const response = {
      recommended_beverage: prediction,
      reason: reason,
      input_data: {
        weather,
        mood,
        temperature,
        humidity,
        timeOfDay
      },
      timestamp: new Date().toISOString()
    };

    console.log('✅ Recommendation generated:', response.recommended_beverage);

    res.json(response);
  } catch (error) {
    console.error('❌ Error in recommendBeverage:', error);
    next(error);
  }
};

/**
 * Recommend beverage based on user location
 */
const getRecommendationWithLocation = async (req, res, next) => {
  try {
    const { latitude, longitude, mood } = req.body;

    // Validate input
    if (!latitude || !longitude) {
      return res.status(400).json({ 
        error: 'Latitude and longitude are required',
        message: 'Please provide valid location coordinates'
      });
    }

    if (!mood) {
      return res.status(400).json({ 
        error: 'Mood is required',
        message: 'Please select your current mood'
      });
    }

    console.log('📍 Fetching weather for location:', { latitude, longitude });

    // Fetch weather data from API
    const weatherData = await getWeatherByLocation(latitude, longitude);

    console.log('🌤️  Weather data retrieved:', weatherData);

    // Get current time of day
    const timeOfDay = getCurrentTimeOfDay();

    // Call Python ML model
    const prediction = await predictBeverage({
      weather: weatherData.weather,
      mood,
      temperature: weatherData.temperature,
      humidity: weatherData.humidity
    });

    // Generate reason for recommendation
    const reason = generateReason(
      prediction, 
      weatherData.weather, 
      mood, 
      weatherData.temperature, 
      timeOfDay
    );

    const response = {
      recommended_beverage: prediction,
      reason: reason,
      location_data: {
        latitude,
        longitude,
        location: weatherData.location,
        country: weatherData.country
      },
      weather_data: {
        weather: weatherData.weather,
        temperature: weatherData.temperature,
        humidity: weatherData.humidity,
        description: weatherData.description
      },
      input_data: {
        mood,
        timeOfDay
      },
      timestamp: new Date().toISOString()
    };

    console.log('✅ Location-based recommendation generated:', response.recommended_beverage);

    res.json(response);
  } catch (error) {
    console.error('❌ Error in getRecommendationWithLocation:', error);
    next(error);
  }
};

/**
 * Submit user feedback for a recommendation
 */
const submitFeedback = async (req, res, next) => {
  try {
    const { 
      recommended_beverage, 
      weather, 
      mood, 
      temperature, 
      humidity, 
      liked, 
      comment 
    } = req.body;

    // Validate required fields
    if (recommended_beverage === undefined || liked === undefined) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'recommended_beverage and liked are required'
      });
    }

    // Save feedback
    const feedback = addFeedback({
      recommended_beverage,
      weather,
      mood,
      temperature,
      humidity,
      liked: Boolean(liked),
      comment: comment || ''
    });

    console.log(`📝 Feedback received: ${liked ? '👍 Liked' : '👎 Disliked'} - ${recommended_beverage}`);

    res.json({
      success: true,
      message: 'Thank you for your feedback! This helps us improve recommendations.',
      feedback_id: feedback.id
    });
  } catch (error) {
    console.error('❌ Error in submitFeedback:', error);
    next(error);
  }
};

/**
 * Get feedback statistics and patterns
 */
const getFeedbackStatistics = async (req, res, next) => {
  try {
    const stats = getFeedbackStats();
    const patterns = getFeedbackPatterns();

    res.json({
      statistics: stats,
      improvement_patterns: patterns,
      message: 'Feedback data successfully retrieved'
    });
  } catch (error) {
    console.error('❌ Error in getFeedbackStatistics:', error);
    next(error);
  }
};

module.exports = {
  recommendBeverage,
  getRecommendationWithLocation,
  submitFeedback,
  getFeedbackStatistics
};
