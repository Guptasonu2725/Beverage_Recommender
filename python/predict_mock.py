#!/usr/bin/env python3
"""
MOCK Beverage Recommendation - For Testing Without Model Files
This script simulates predictions using rule-based logic with better variety
Replace this with predict.py once your pickle files are fixed
"""

import sys
import json
import random

def mock_predict_beverage(weather, mood, temperature, humidity):
    """
    Mock prediction based on comprehensive rules with variety
    """
    # Comprehensive rule-based recommendations with multiple options
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
    
    # Try exact match first and return random option from the list
    key = (weather, mood)
    if key in beverages:
        return random.choice(beverages[key])
    
    # More intelligent temperature-based fallback with mood consideration
    if temperature > 35:  # Very hot
        mood_map = {
            'Tired': ['Iced Coffee', 'Cold Brew', 'Iced Latte'],
            'Stressed': ['Iced Tea', 'Mint Lemonade', 'Cucumber Water'],
            'Happy': ['Fresh Juice', 'Fruit Smoothie', 'Tropical Drink'],
            'Sad': ['Iced Chocolate', 'Milkshake', 'Smoothie'],
            'Energetic': ['Energy Drink', 'Cold Coffee', 'Iced Green Tea'],
            'Relaxed': ['Coconut Water', 'Iced Herbal Tea', 'Lemonade'],
            'Focused': ['Cold Brew', 'Iced Americano', 'Iced Matcha'],
            'Excited': ['Energy Drink', 'Tropical Smoothie', 'Iced Coffee']
        }
        return random.choice(mood_map.get(mood, ['Iced Tea', 'Cold Water', 'Lemonade']))
    
    elif temperature > 25:  # Warm
        mood_map = {
            'Tired': ['Iced Coffee', 'Cold Brew', 'Iced Tea'],
            'Happy': ['Lemonade', 'Fresh Juice', 'Smoothie'],
            'Stressed': ['Iced Tea', 'Herbal Iced Tea', 'Lemonade'],
            'Sad': ['Iced Mocha', 'Milkshake', 'Smoothie'],
            'Energetic': ['Iced Green Tea', 'Cold Coffee', 'Smoothie'],
            'Relaxed': ['Iced Herbal Tea', 'Lemonade', 'Fresh Juice'],
            'Focused': ['Iced Americano', 'Green Tea', 'Cold Brew'],
            'Excited': ['Tropical Smoothie', 'Energy Drink', 'Iced Coffee']
        }
        return random.choice(mood_map.get(mood, ['Iced Tea', 'Lemonade', 'Fresh Juice']))
    
    elif temperature < 10:  # Very cold
        mood_map = {
            'Tired': ['Hot Coffee', 'Espresso', 'Strong Black Tea'],
            'Happy': ['Hot Chocolate', 'Caramel Latte', 'Mocha'],
            'Stressed': ['Chamomile Tea', 'Lavender Tea', 'Warm Milk'],
            'Sad': ['Hot Chocolate', 'Warm Milk with Honey', 'Comfort Tea'],
            'Energetic': ['Black Coffee', 'Espresso', 'Americano'],
            'Relaxed': ['Herbal Tea', 'Chamomile Tea', 'Ginger Tea'],
            'Focused': ['Black Coffee', 'Green Tea', 'Espresso'],
            'Excited': ['Strong Coffee', 'Espresso', 'Chai Latte']
        }
        return random.choice(mood_map.get(mood, ['Hot Coffee', 'Hot Tea', 'Hot Chocolate']))
    
    elif temperature < 20:  # Cool
        mood_map = {
            'Tired': ['Hot Coffee', 'Cappuccino', 'Black Tea'],
            'Happy': ['Cappuccino', 'Latte', 'Hot Chocolate'],
            'Stressed': ['Green Tea', 'Herbal Tea', 'Chamomile Tea'],
            'Sad': ['Hot Chocolate', 'Mocha', 'Warm Milk'],
            'Energetic': ['Black Coffee', 'Americano', 'Chai'],
            'Relaxed': ['Herbal Tea', 'Green Tea', 'White Tea'],
            'Focused': ['Green Tea', 'Black Coffee', 'Oolong Tea'],
            'Excited': ['Cappuccino', 'Espresso', 'Chai Latte']
        }
        return random.choice(mood_map.get(mood, ['Hot Coffee', 'Green Tea', 'Cappuccino']))
    
    else:  # Moderate (20-25°C)
        mood_map = {
            'Tired': ['Coffee', 'Iced Coffee', 'Black Tea'],
            'Happy': ['Cappuccino', 'Fresh Juice', 'Lemonade'],
            'Stressed': ['Green Tea', 'Herbal Tea', 'Iced Tea'],
            'Sad': ['Hot Chocolate', 'Mocha', 'Smoothie'],
            'Energetic': ['Cold Brew', 'Green Tea', 'Smoothie'],
            'Relaxed': ['Herbal Tea', 'Iced Tea', 'Green Tea'],
            'Focused': ['Green Tea', 'Americano', 'Matcha'],
            'Excited': ['Cappuccino', 'Iced Coffee', 'Fresh Juice']
        }
        return random.choice(mood_map.get(mood, ['Green Tea', 'Coffee', 'Fresh Juice']))


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
        
        # Make mock prediction
        predicted_beverage = mock_predict_beverage(weather, mood, temperature, humidity)
        
        # Return result as JSON
        result = {
            "prediction": predicted_beverage,
            "success": True,
            "note": "Using mock predictor - Replace with actual ML model"
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
