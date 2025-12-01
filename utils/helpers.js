/**
 * Get current time of day based on server time
 */
const getCurrentTimeOfDay = () => {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    return 'Morning';
  } else if (hour >= 12 && hour < 17) {
    return 'Afternoon';
  } else if (hour >= 17 && hour < 21) {
    return 'Evening';
  } else {
    return 'Night';
  }
};

/**
 * Generate a human-readable reason for the beverage recommendation
 * Produces a richer, multi-sentence explanation with serving suggestions,
 * sensory language, small tips, and occasional pairing suggestions to
 * make the recommendation feel more personal and less repetitive.
 */
const generateReason = (beverage, weather, mood, temperature, timeOfDay) => {
  // Comprehensive mood-specific explanations for why beverage suits the mood
  const moodBeverageExplanations = {
    'Happy': {
      generic: 'which complements your cheerful mood perfectly',
      cold: 'to celebrate your happiness with something refreshing',
      hot: 'to enhance your joyful spirits',
      caffeine: 'to keep your positive energy flowing',
      juice: 'to match your bright and vibrant mood',
      tea: 'to maintain your happy and relaxed state'
    },
    'Sad': {
      generic: 'to comfort you and lift your spirits',
      cold: 'to provide a sweet pick-me-up',
      hot: 'to warm your heart and bring comfort',
      caffeine: 'to boost your mood and energy',
      chocolate: 'for its mood-lifting properties',
      tea: 'to provide gentle comfort and relaxation'
    },
    'Energetic': {
      generic: 'to match and sustain your high energy levels',
      cold: 'to keep you refreshed while you stay active',
      hot: 'to fuel your dynamic energy',
      caffeine: 'to amplify your natural vigor',
      juice: 'to provide quick energy to match your pace',
      smoothie: 'to power your active lifestyle'
    },
    'Tired': {
      generic: 'to help you recharge and regain energy',
      cold: 'to refresh and revitalize you instantly',
      hot: 'to provide gentle, sustained energy',
      caffeine: 'to combat fatigue and boost alertness',
      juice: 'to give you a natural energy lift',
      tea: 'to gently wake you up and restore focus'
    },
    'Stressed': {
      generic: 'to help you relax and find calm',
      cold: 'to cool down and ease tension',
      hot: 'to provide soothing warmth and relaxation',
      caffeine: 'with calming properties to reduce stress',
      herbal: 'known for its stress-relieving benefits',
      tea: 'to help you unwind and release tension'
    },
    'Relaxed': {
      generic: 'to maintain your peaceful state of mind',
      cold: 'to keep you refreshed while you unwind',
      hot: 'to enhance your calm and tranquil mood',
      caffeine: 'with a gentle boost without disrupting your peace',
      juice: 'to complement your laid-back vibe',
      tea: 'to deepen your sense of relaxation'
    },
    'Focused': {
      generic: 'to help you maintain sharp concentration',
      cold: 'to keep you alert and mentally clear',
      hot: 'to enhance cognitive function and focus',
      caffeine: 'to boost mental clarity and attention',
      tea: 'known for improving focus and concentration',
      matcha: 'for sustained focus without jitters'
    },
    'Excited': {
      generic: 'to match your enthusiastic energy',
      cold: 'to keep your excitement refreshed and alive',
      hot: 'to amplify your thrilling mood',
      caffeine: 'to elevate your already high spirits',
      juice: 'to add to your vibrant excitement',
      energy: 'to match your electrifying enthusiasm'
    }
  };

  const weatherReasons = {
    'Hot': 'the scorching heat',
    'Sunny': 'the bright and sunny weather',
    'Cold': 'the chilly weather',
    'Rainy': 'the rainy conditions',
    'Cloudy': 'the overcast sky',
    'Snowy': 'the snowy weather',
    'Stormy': 'the stormy conditions',
    'Windy': 'the windy weather',
    'Foggy': 'the misty atmosphere'
  };

  const timeReasons = {
    'Morning': 'to start your day right',
    'Afternoon': 'to power through the afternoon',
    'Evening': 'to unwind in the evening',
    'Night': 'to wind down for the night'
  };

  const weatherReason = weatherReasons[weather] || 'the current weather';
  const timeReason = timeReasons[timeOfDay] || 'this time of day';

  // Determine beverage type for mood-specific explanation
  const beverageLower = beverage.toLowerCase();
  let moodExplanationType = 'generic';

  if (beverageLower.includes('iced') || beverageLower.includes('cold') || 
      beverageLower.includes('smoothie') || beverageLower.includes('juice') ||
      beverageLower.includes('lemonade') || beverageLower.includes('water')) {
    moodExplanationType = 'cold';
  } else if (beverageLower.includes('hot') || beverageLower.includes('warm')) {
    moodExplanationType = 'hot';
  }

  if (beverageLower.includes('coffee') || beverageLower.includes('espresso') || 
      beverageLower.includes('cappuccino') || beverageLower.includes('latte') ||
      beverageLower.includes('americano') || beverageLower.includes('brew')) {
    moodExplanationType = 'caffeine';
  } else if (beverageLower.includes('chocolate') || beverageLower.includes('mocha')) {
    moodExplanationType = 'chocolate';
  } else if (beverageLower.includes('juice')) {
    moodExplanationType = 'juice';
  } else if (beverageLower.includes('smoothie')) {
    moodExplanationType = 'smoothie';
  } else if (beverageLower.includes('tea')) {
    if (beverageLower.includes('chamomile') || beverageLower.includes('herbal') || 
        beverageLower.includes('lavender')) {
      moodExplanationType = 'herbal';
    } else if (beverageLower.includes('matcha')) {
      moodExplanationType = 'matcha';
    } else {
      moodExplanationType = 'tea';
    }
  } else if (beverageLower.includes('energy')) {
    moodExplanationType = 'energy';
  }

  // Get mood-specific explanation
  const moodExplanations = moodBeverageExplanations[mood] || {};
  const moodReason = moodExplanations[moodExplanationType] || moodExplanations['generic'] || 'to suit your current mood';

  // Temperature-specific additions and sensory notes
  let tempContext = '';
  if (temperature > 35) {
    tempContext = ' The extreme heat makes a cooling beverage essential — something crisp and hydrating will help you stay comfortable.';
  } else if (temperature > 25) {
    tempContext = ' The warm temperature makes this refreshing choice ideal — expect bright, citrusy or iced notes.';
  } else if (temperature < 10) {
    tempContext = ' The cold weather calls for something warming and comforting — think cozy, spiced, and mellow flavors.';
  } else if (temperature < 20) {
    tempContext = ' The cool temperature makes this a perfect fit — a gentle warm or rich option works nicely.';
  }

  // Build richer, multi-sentence explanations with variability
  const sensoryPhrases = [
    'You might notice pleasant notes of',
    'Expect a balanced profile with',
    'It often comes with',
    'This choice highlights'
  ];

  const servingSuggestions = [
    `Serve ${beverage} ${beverageLower.includes('iced') || beverageLower.includes('cold') ? 'over ice for maximum refreshment' : 'warm and enjoy slowly'}.`,
    `Try pairing it with a light snack — fresh fruit, a buttery biscuit, or a small savory bite complements it well.`,
    `If you like twists, add a squeeze of lemon, a dash of cinnamon, or a mint sprig to elevate the flavor.`
  ];

  const healthNotes = [
    'A lighter option that helps hydration and subtle energy without overwhelming your senses.',
    'A comforting pick that can help soothe and calm your mood.',
    'A great balance of flavor and refreshment that supports alertness when needed.'
  ];

  const funTips = [
    'Pro tip: try it chilled with a sprig of mint for an instant pick-me-up.',
    'Fun idea: pair this with mellow acoustic music to enhance the relaxed vibe.',
    'Small tip: sip slowly and notice which flavor notes you like most — it helps refine future picks.'
  ];

  // Randomize selections to reduce repetition
  const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const firstSentence = `Based on ${weatherReason} and ${timeReason}, ${beverage} is a great match ${moodReason}.`;
  const sensory = `${rand(sensoryPhrases)} ${beverageLower.includes('coffee') ? 'roasted, chocolaty, and nutty notes.' : beverageLower.includes('tea') ? 'delicate herbal and floral tones.' : beverageLower.includes('juice') || beverageLower.includes('smoothie') ? 'fresh, fruity brightness and natural sweetness.' : 'a delightful flavor balance.'}`;
  const serve = rand(servingSuggestions);
  const health = rand(healthNotes);
  const tip = rand(funTips);

  // Optional pairing based on mood and beverage
  let pairing = '';
  if (mood === 'Happy' || mood === 'Excited') {
    pairing = ' Consider pairing it with a small tropical snack or fruit salad to amplify the cheerful feeling.';
  } else if (mood === 'Stressed' || mood === 'Relaxed') {
    pairing = ' A light biscuit or herbal cookie pairs nicely and keeps the calm going.';
  } else if (mood === 'Focused') {
    pairing = ' A small protein-rich snack (nuts or yogurt) can help sustain focus.';
  }

  // Assemble final descriptive paragraph (3-5 sentences)
  const paragraphs = [firstSentence, sensory, serve, `${health} ${pairing}`, tip];

  // Return joined, trimmed text
  return paragraphs.filter(Boolean).join(' ');
};

module.exports = {
  getCurrentTimeOfDay,
  generateReason
};
