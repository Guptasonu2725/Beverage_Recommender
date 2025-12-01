#!/usr/bin/env python3
"""
Beverage Recommendation ML Model - Prediction Script
This script loads the trained model and encoders, makes predictions
"""

import sys
import json
import pickle
import numpy as np
import os
from pathlib import Path

# Get the parent directory to access the .pkl files
BASE_DIR = Path(__file__).resolve().parent.parent

# Paths to model and encoder files
MODEL_PATH = BASE_DIR / 'beverage_model.pkl'
FEATURE_ENCODER_PATH = BASE_DIR / 'feature_encoder.pkl'
TARGET_ENCODER_PATH = BASE_DIR / 'target_encoder.pkl'


def load_model_and_encoders():
    """Load the trained model and encoders"""
    try:
        # Try different encoding methods for compatibility
        with open(MODEL_PATH, 'rb') as f:
            model = pickle.load(f, encoding='latin1')
        
        with open(FEATURE_ENCODER_PATH, 'rb') as f:
            feature_encoder = pickle.load(f, encoding='latin1')
        
        with open(TARGET_ENCODER_PATH, 'rb') as f:
            target_encoder = pickle.load(f, encoding='latin1')
        
        return model, feature_encoder, target_encoder
    except FileNotFoundError as e:
        raise Exception(f"Model files not found: {e}")
    except Exception as e:
        raise Exception(f"Error loading model: {e}")


def encode_categorical_features(weather, mood, feature_encoder):
    try:
        # Combine weather and mood with underscore
        combined_feature = f"{weather}_{mood}"
        
        # Encode the combined feature
        encoded = feature_encoder.transform([combined_feature])
        
        return encoded[0]
    except ValueError as e:
        # Handle unknown categories
        raise Exception(f"Unknown weather or mood combination: {combined_feature}. Error: {e}")
    except Exception as e:
        raise Exception(f"Error encoding features: {e}")


def predict_beverage(weather, mood, temperature, humidity, model, feature_encoder, target_encoder):
    try:
        # Encode categorical features
        encoded_feature = encode_categorical_features(weather, mood, feature_encoder)
        
        # Combine encoded feature with numeric features
        # Format: [encoded_weather_mood, temperature, humidity]
        input_features = np.array([[encoded_feature, temperature, humidity]])
        
        # Make prediction
        prediction_encoded = model.predict(input_features)
        
        # Decode the prediction
        predicted_beverage = target_encoder.inverse_transform(prediction_encoded)[0]
        
        return predicted_beverage
    
    except Exception as e:
        raise Exception(f"Prediction error: {e}")


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
        
        # Load model and encoders
        model, feature_encoder, target_encoder = load_model_and_encoders()
        
        # Make prediction
        predicted_beverage = predict_beverage(
            weather, mood, temperature, humidity,
            model, feature_encoder, target_encoder
        )
        
        # Return result as JSON
        result = {
            "prediction": predicted_beverage,
            "success": True
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
