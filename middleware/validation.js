/**
 * Validate recommendation input
 */
const validateRecommendationInput = (req, res, next) => {
  const { weather, mood, temperature, humidity } = req.body;

  const errors = [];

  // Check required fields
  if (!weather) {
    errors.push('Weather is required');
  }

  if (!mood) {
    errors.push('Mood is required');
  }

  if (temperature === undefined || temperature === null) {
    errors.push('Temperature is required');
  } else if (isNaN(temperature)) {
    errors.push('Temperature must be a number');
  }

  if (humidity === undefined || humidity === null) {
    errors.push('Humidity is required');
  } else if (isNaN(humidity)) {
    errors.push('Humidity must be a number');
  }

  // Validate ranges
  if (humidity && (humidity < 0 || humidity > 100)) {
    errors.push('Humidity must be between 0 and 100');
  }

  if (temperature && (temperature < -50 || temperature > 60)) {
    errors.push('Temperature must be between -50 and 60 degrees Celsius');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors
    });
  }

  next();
};

module.exports = {
  validateRecommendationInput
};
