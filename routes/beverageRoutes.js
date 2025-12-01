const express = require('express');
const router = express.Router();
const { recommendBeverage, getRecommendationWithLocation, submitFeedback, getFeedbackStatistics } = require('../controllers/beverageController');
const { validateRecommendationInput } = require('../middleware/validation');

/**
 * @route   POST /api/beverage/recommend
 * @desc    Get beverage recommendation based on manual input
 * @access  Public
 * @body    { weather, mood, temperature, humidity }
 */
router.post('/recommend', validateRecommendationInput, recommendBeverage);

/**
 * @route   POST /api/beverage/recommend-location
 * @desc    Get beverage recommendation based on user location
 * @access  Public
 * @body    { latitude, longitude, mood }
 */
router.post('/recommend-location', getRecommendationWithLocation);

/**
 * @route   POST /api/beverage/feedback
 * @desc    Submit feedback for a recommendation
 * @access  Public
 * @body    { recommended_beverage, weather, mood, temperature, humidity, liked, comment }
 */
router.post('/feedback', submitFeedback);

/**
 * @route   GET /api/beverage/feedback/stats
 * @desc    Get feedback statistics and patterns
 * @access  Public
 */
router.get('/feedback/stats', getFeedbackStatistics);

/**
 * @route   GET /api/beverage/moods
 * @desc    Get list of available moods
 * @access  Public
 */
router.get('/moods', (req, res) => {
  res.json({
    moods: [
      'Happy',
      'Sad',
      'Energetic',
      'Tired',
      'Stressed',
      'Relaxed',
      'Focused',
      'Excited'
    ]
  });
});

/**
 * @route   GET /api/beverage/weather-types
 * @desc    Get list of weather types
 * @access  Public
 */
router.get('/weather-types', (req, res) => {
  res.json({
    weatherTypes: [
      'Sunny',
      'Cloudy',
      'Rainy',
      'Stormy',
      'Snowy',
      'Windy',
      'Foggy',
      'Hot',
      'Cold'
    ]
  });
});

module.exports = router;
