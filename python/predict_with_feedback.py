#!/usr/bin/env python3
"""
SMART Beverage Recommendation - Learns from User Feedback
This predictor uses feedback data to avoid disliked beverages and prefer liked ones
"""

import sys
import json
import random
import os

# Path to feedback file
FEEDBACK_FILE = os.path.join(os.path.dirname(__file__), '../data/feedback.json')

def load_feedback():
    """Load feedback data from JSON file"""
    try:
        if os.path.exists(FEEDBACK_FILE):
            with open(FEEDBACK_FILE, 'r') as f:
                data = json.load(f)
                return data.get('feedbacks', [])
        return []
    except Exception as e:
        print(f"Warning: Could not load feedback: {e}", file=sys.stderr)
        return []

def get_feedback_preferences(weather, mood, temperature):
    """
    Analyze feedback to determine liked and disliked beverages
    for this specific weather/mood/temperature combination
    """
    feedbacks = load_feedback()
    
    # Temperature range (±5 degrees)
    temp_min = temperature - 5
    temp_max = temperature + 5
    
    liked_beverages = []
    disliked_beverages = []
    
    for feedback in feedbacks:
        # Match similar conditions
        if (feedback['weather'] == weather and 
            feedback['mood'] == mood and 
            temp_min <= feedback['temperature'] <= temp_max):
            
            beverage = feedback['recommended_beverage']
            
            if feedback['liked']:
                liked_beverages.append(beverage)
            else:
                disliked_beverages.append(beverage)
    
    return {
        'liked': list(set(liked_beverages)),  # Remove duplicates
        'disliked': list(set(disliked_beverages)),
        'total_feedback': len(feedbacks)
    }

def predict_beverage_with_feedback(weather, mood, temperature, humidity):
    """
    Predict beverage using rules + feedback learning
    """
    # Get feedback preferences
    preferences = get_feedback_preferences(weather, mood, temperature)
    
    # Base beverage options (same as before)
    beverages = {
        # Hot weather combinations
        ('Hot', 'Tired'): ['Iced Coffee', 'Cold Brew', 'Iced Latte'],
        ('Hot', 'Energetic'): ['Energy Drink', 'Iced Green Tea', 'Cold Coffee'],
        ('Hot', 'Happy'): ['Fresh Juice', 'Fruit Smoothie', 'Iced Tea'],
        ('Hot', 'Stressed'): ['Iced Tea', 'Mint Lemonade', 'Cucumber Water'],
        ('Hot', 'Sad'): ['Mango Smoothie', 'Strawberry Shake', 'Iced Chocolate'],
        ('Hot', 'Relaxed'): ['Iced Herbal Tea', 'Coconut Water', 'Watermelon Juice'],
        ('Hot', 'Focused'): ['Cold Brew Coffee', 'Iced Green Tea', 'Iced Matcha'],
        ('Hot', 'Excited'): ['Energy Drink', 'Orange Juice', 'Tropical Smoothie'],
        
        # Sunny weather combinations
        ('Sunny', 'Happy'): ['Lemonade', 'Orange Juice', 'Pineapple Juice'],
        ('Sunny', 'Tired'): ['Iced Coffee', 'Cold Brew', 'Iced Americano'],
        ('Sunny', 'Energetic'): ['Smoothie', 'Fresh Juice', 'Iced Green Tea'],
        ('Sunny', 'Stressed'): ['Iced Tea', 'Lemonade', 'Herbal Iced Tea'],
        ('Sunny', 'Sad'): ['Chocolate Smoothie', 'Strawberry Milkshake', 'Iced Mocha'],
        ('Sunny', 'Relaxed'): ['Coconut Water', 'Iced Herbal Tea', 'Fresh Lemonade'],
        ('Sunny', 'Focused'): ['Iced Americano', 'Green Tea', 'Iced Matcha'],
        ('Sunny', 'Excited'): ['Tropical Smoothie', 'Mango Lassi', 'Berry Smoothie'],
        
        # Cold weather combinations
        ('Cold', 'Tired'): ['Hot Coffee', 'Cappuccino', 'Espresso'],
        ('Cold', 'Happy'): ['Hot Chocolate', 'Caramel Latte', 'Mocha'],
        ('Cold', 'Stressed'): ['Chamomile Tea', 'Green Tea', 'Lavender Tea'],
        ('Cold', 'Sad'): ['Hot Chocolate', 'Warm Milk', 'Caramel Macchiato'],
        ('Cold', 'Energetic'): ['Hot Coffee', 'Black Tea', 'Chai Latte'],
        ('Cold', 'Relaxed'): ['Herbal Tea', 'Green Tea', 'White Tea'],
        ('Cold', 'Focused'): ['Black Coffee', 'Green Tea', 'Matcha Latte'],
        ('Cold', 'Excited'): ['Spiced Chai', 'Hot Coffee', 'Cinnamon Latte'],
        
        # Rainy weather combinations
        ('Rainy', 'Relaxed'): ['Herbal Tea', 'Chamomile Tea', 'Ginger Tea'],
        ('Rainy', 'Sad'): ['Hot Chocolate', 'Warm Milk', 'Honey Tea'],
        ('Rainy', 'Happy'): ['Chai', 'Masala Chai', 'Spiced Tea'],
        ('Rainy', 'Tired'): ['Hot Coffee', 'Cappuccino', 'Latte'],
        ('Rainy', 'Stressed'): ['Chamomile Tea', 'Lavender Tea', 'Green Tea'],
        ('Rainy', 'Energetic'): ['Black Coffee', 'Chai Latte', 'Black Tea'],
        ('Rainy', 'Focused'): ['Green Tea', 'Black Coffee', 'Oolong Tea'],
        ('Rainy', 'Excited'): ['Masala Chai', 'Hot Chocolate', 'Spiced Coffee'],
        
        # Cloudy weather combinations
        ('Cloudy', 'Focused'): ['Green Tea', 'Black Coffee', 'Matcha'],
        ('Cloudy', 'Happy'): ['Cappuccino', 'Latte', 'Hot Chocolate'],
        ('Cloudy', 'Tired'): ['Coffee', 'Espresso', 'Black Tea'],
        ('Cloudy', 'Stressed'): ['Green Tea', 'Herbal Tea', 'White Tea'],
        ('Cloudy', 'Sad'): ['Hot Chocolate', 'Mocha', 'Caramel Latte'],
        ('Cloudy', 'Energetic'): ['Black Coffee', 'Americano', 'Cold Brew'],
        ('Cloudy', 'Relaxed'): ['Herbal Tea', 'Green Tea', 'Chamomile Tea'],
        ('Cloudy', 'Excited'): ['Cappuccino', 'Espresso', 'Iced Coffee'],
        
        # Snowy weather combinations
        ('Snowy', 'Happy'): ['Hot Chocolate', 'Peppermint Mocha', 'Eggnog'],
        ('Snowy', 'Tired'): ['Hot Coffee', 'Espresso', 'Strong Black Tea'],
        ('Snowy', 'Stressed'): ['Chamomile Tea', 'Warm Milk', 'Lavender Tea'],
        ('Snowy', 'Sad'): ['Hot Chocolate', 'Warm Milk with Honey', 'Vanilla Latte'],
        ('Snowy', 'Energetic'): ['Black Coffee', 'Espresso', 'Americano'],
        ('Snowy', 'Relaxed'): ['Herbal Tea', 'Cinnamon Tea', 'Ginger Tea'],
        ('Snowy', 'Focused'): ['Black Coffee', 'Green Tea', 'Espresso'],
        ('Snowy', 'Excited'): ['Hot Chocolate', 'Peppermint Latte', 'Spiced Coffee'],
        
        # Stormy weather combinations
        ('Stormy', 'Stressed'): ['Chamomile Tea', 'Lavender Tea', 'Warm Milk'],
        ('Stormy', 'Sad'): ['Hot Chocolate', 'Comfort Tea', 'Honey Tea'],
        ('Stormy', 'Tired'): ['Strong Coffee', 'Black Tea', 'Espresso'],
        ('Stormy', 'Happy'): ['Chai', 'Hot Chocolate', 'Spiced Tea'],
        ('Stormy', 'Energetic'): ['Black Coffee', 'Americano', 'Strong Tea'],
        ('Stormy', 'Relaxed'): ['Herbal Tea', 'Chamomile Tea', 'Green Tea'],
        ('Stormy', 'Focused'): ['Black Coffee', 'Green Tea', 'Oolong Tea'],
        ('Stormy', 'Excited'): ['Espresso', 'Strong Coffee', 'Chai Latte'],
        
        # Windy weather combinations
        ('Windy', 'Energetic'): ['Cold Brew', 'Iced Coffee', 'Energy Drink'],
        ('Windy', 'Happy'): ['Fresh Juice', 'Smoothie', 'Iced Tea'],
        ('Windy', 'Tired'): ['Hot Coffee', 'Cappuccino', 'Latte'],
        ('Windy', 'Stressed'): ['Green Tea', 'Herbal Tea', 'Chamomile Tea'],
        ('Windy', 'Sad'): ['Hot Chocolate', 'Warm Beverage', 'Comfort Drink'],
        ('Windy', 'Relaxed'): ['Herbal Tea', 'Green Tea', 'Iced Tea'],
        ('Windy', 'Focused'): ['Black Coffee', 'Green Tea', 'Americano'],
        ('Windy', 'Excited'): ['Energy Drink', 'Cold Brew', 'Iced Coffee'],
        
        # Foggy weather combinations
        ('Foggy', 'Relaxed'): ['Herbal Tea', 'Chamomile Tea', 'Green Tea'],
        ('Foggy', 'Tired'): ['Hot Coffee', 'Black Tea', 'Espresso'],
        ('Foggy', 'Happy'): ['Cappuccino', 'Latte', 'Hot Chocolate'],
        ('Foggy', 'Stressed'): ['Chamomile Tea', 'Lavender Tea', 'Green Tea'],
        ('Foggy', 'Sad'): ['Hot Chocolate', 'Warm Milk', 'Honey Tea'],
        ('Foggy', 'Energetic'): ['Black Coffee', 'Americano', 'Strong Tea'],
        ('Foggy', 'Focused'): ['Green Tea', 'Black Coffee', 'Matcha'],
        ('Foggy', 'Excited'): ['Espresso', 'Cappuccino', 'Strong Coffee'],
    }
    
    # Get base options
    key = (weather, mood)
    if key in beverages:
        options = beverages[key].copy()
    else:
        # Temperature-based fallback
        if temperature > 35:
            options = ['Iced Coffee', 'Cold Brew', 'Lemonade', 'Iced Tea']
        elif temperature > 25:
            options = ['Iced Coffee', 'Lemonade', 'Fresh Juice']
        elif temperature < 10:
            options = ['Hot Coffee', 'Hot Tea', 'Hot Chocolate']
        elif temperature < 20:
            options = ['Hot Coffee', 'Cappuccino', 'Green Tea']
        else:
            options = ['Green Tea', 'Coffee', 'Fresh Juice']
    
    # LEARNING PHASE: Apply feedback filtering
    
    # Step 1: Remove disliked beverages
    filtered_options = [b for b in options if b not in preferences['disliked']]
    
    # Step 2: If we filtered everything, keep original options (avoid empty list)
    if not filtered_options:
        filtered_options = options
    
    # Step 3: Prefer liked beverages (increase their weight)
    weighted_options = []
    for beverage in filtered_options:
        if beverage in preferences['liked']:
            # Add liked beverages 3 times (3x probability)
            weighted_options.extend([beverage] * 3)
        else:
            # Add normal beverages once
            weighted_options.append(beverage)
    
    # Step 4: Select random beverage from weighted options
    selected_beverage = random.choice(weighted_options)
    
    return selected_beverage, preferences


def main():
    """Main function to handle prediction"""
    try:
        # Get input data from command line arguments
        if len(sys.argv) < 2:
            raise Exception("No input data provided")
        
        # Parse JSON input
        input_data = json.loads(sys.argv[1])
        
        # Extract features
        weather = input_data.get('weather')
        mood = input_data.get('mood')
        temperature = input_data.get('temperature')
        humidity = input_data.get('humidity')
        
        # Validate input
        if not all([weather, mood, temperature is not None, humidity is not None]):
            raise Exception("Missing required fields: weather, mood, temperature, humidity")
        
        # Make smart prediction with feedback learning
        predicted_beverage, preferences = predict_beverage_with_feedback(
            weather, mood, temperature, humidity
        )
        
        # Return result as JSON
        result = {
            "prediction": predicted_beverage,
            "success": True,
            "learning_applied": True,
            "feedback_stats": {
                "total_feedbacks": preferences['total_feedback'],
                "liked_for_this_combo": len(preferences['liked']),
                "disliked_for_this_combo": len(preferences['disliked']),
                "filtered_out": preferences['disliked']
            }
        }
        
        print(json.dumps(result))
        sys.exit(0)
        
    except Exception as e:
        # Return error as JSON
        error_result = {
            "error": str(e),
            "success": False
        }
        print(json.dumps(error_result))
        sys.exit(1)


if __name__ == "__main__":
    main()
