const fs = require('fs');
const path = require('path');

// Feedback storage file
const FEEDBACK_FILE = path.join(__dirname, '../data/feedback.json');

/**
 * Ensure feedback directory and file exist
 */
const ensureFeedbackFile = () => {
  const dir = path.dirname(FEEDBACK_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(FEEDBACK_FILE)) {
    fs.writeFileSync(FEEDBACK_FILE, JSON.stringify({ feedbacks: [] }, null, 2));
  }
};

/**
 * Load feedback data
 */
const loadFeedback = () => {
  ensureFeedbackFile();
  try {
    const data = fs.readFileSync(FEEDBACK_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading feedback:', error);
    return { feedbacks: [] };
  }
};

/**
 * Save feedback data
 */
const saveFeedback = (data) => {
  try {
    fs.writeFileSync(FEEDBACK_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving feedback:', error);
    return false;
  }
};

/**
 * Add new feedback
 */
const addFeedback = (feedbackData) => {
  const data = loadFeedback();
  
  const feedback = {
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    ...feedbackData
  };
  
  data.feedbacks.push(feedback);
  
  // Keep only last 1000 feedbacks
  if (data.feedbacks.length > 1000) {
    data.feedbacks = data.feedbacks.slice(-1000);
  }
  
  saveFeedback(data);
  return feedback;
};

/**
 * Get feedback statistics
 */
const getFeedbackStats = () => {
  const data = loadFeedback();
  const feedbacks = data.feedbacks;
  
  if (feedbacks.length === 0) {
    return {
      total: 0,
      satisfied: 0,
      dissatisfied: 0,
      satisfactionRate: 0,
      topBeverages: [],
      worstBeverages: []
    };
  }
  
  const satisfied = feedbacks.filter(f => f.liked === true).length;
  const dissatisfied = feedbacks.filter(f => f.liked === false).length;
  
  // Count beverage occurrences by satisfaction
  const beverageStats = {};
  feedbacks.forEach(f => {
    const beverage = f.recommended_beverage;
    if (!beverageStats[beverage]) {
      beverageStats[beverage] = { likes: 0, dislikes: 0, total: 0 };
    }
    beverageStats[beverage].total++;
    if (f.liked) {
      beverageStats[beverage].likes++;
    } else {
      beverageStats[beverage].dislikes++;
    }
  });
  
  // Calculate satisfaction rate for each beverage
  const beverageRatings = Object.entries(beverageStats).map(([name, stats]) => ({
    name,
    ...stats,
    satisfactionRate: (stats.likes / stats.total) * 100
  }));
  
  // Sort by satisfaction rate
  const topBeverages = beverageRatings
    .sort((a, b) => b.satisfactionRate - a.satisfactionRate)
    .slice(0, 5);
  
  const worstBeverages = beverageRatings
    .sort((a, b) => a.satisfactionRate - b.satisfactionRate)
    .filter(b => b.total >= 3) // Only include beverages with at least 3 feedbacks
    .slice(0, 5);
  
  return {
    total: feedbacks.length,
    satisfied,
    dissatisfied,
    satisfactionRate: ((satisfied / feedbacks.length) * 100).toFixed(2),
    topBeverages,
    worstBeverages,
    recentFeedbacks: feedbacks.slice(-10).reverse()
  };
};

/**
 * Get feedback patterns for retraining
 */
const getFeedbackPatterns = () => {
  const data = loadFeedback();
  const feedbacks = data.feedbacks.filter(f => f.liked === false); // Focus on negative feedback
  
  // Group by input patterns
  const patterns = {};
  feedbacks.forEach(f => {
    const key = `${f.weather}_${f.mood}_${Math.floor(f.temperature/10)*10}`;
    if (!patterns[key]) {
      patterns[key] = {
        weather: f.weather,
        mood: f.mood,
        tempRange: `${Math.floor(f.temperature/10)*10}-${Math.floor(f.temperature/10)*10+10}°C`,
        dislikedBeverages: [],
        count: 0
      };
    }
    patterns[key].dislikedBeverages.push(f.recommended_beverage);
    patterns[key].count++;
  });
  
  return Object.values(patterns).sort((a, b) => b.count - a.count);
};

module.exports = {
  addFeedback,
  getFeedbackStats,
  getFeedbackPatterns,
  loadFeedback
};
