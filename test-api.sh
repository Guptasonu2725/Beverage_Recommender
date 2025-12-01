#!/bin/bash

# Color codes for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Beverage API Testing Script${NC}"
echo -e "${BLUE}========================================${NC}\n"

BASE_URL="http://localhost:3000"

# Test 1: Health Check
echo -e "${GREEN}Test 1: Health Check${NC}"
curl -s $BASE_URL/health | json_pp
echo -e "\n"

# Test 2: Get Available Moods
echo -e "${GREEN}Test 2: Get Available Moods${NC}"
curl -s $BASE_URL/api/beverage/moods | json_pp
echo -e "\n"

# Test 3: Get Weather Types
echo -e "${GREEN}Test 3: Get Weather Types${NC}"
curl -s $BASE_URL/api/beverage/weather-types | json_pp
echo -e "\n"

# Test 4: Manual Recommendation (Sunny & Happy)
echo -e "${GREEN}Test 4: Manual Recommendation (Sunny & Happy)${NC}"
curl -s -X POST $BASE_URL/api/beverage/recommend \
  -H "Content-Type: application/json" \
  -d '{
    "weather": "Sunny",
    "mood": "Happy",
    "temperature": 32,
    "humidity": 60
  }' | json_pp
echo -e "\n"

# Test 5: Manual Recommendation (Rainy & Relaxed)
echo -e "${GREEN}Test 5: Manual Recommendation (Rainy & Relaxed)${NC}"
curl -s -X POST $BASE_URL/api/beverage/recommend \
  -H "Content-Type: application/json" \
  -d '{
    "weather": "Rainy",
    "mood": "Relaxed",
    "temperature": 20,
    "humidity": 80
  }' | json_pp
echo -e "\n"

# Test 6: Manual Recommendation (Cold & Tired)
echo -e "${GREEN}Test 6: Manual Recommendation (Cold & Tired)${NC}"
curl -s -X POST $BASE_URL/api/beverage/recommend \
  -H "Content-Type: application/json" \
  -d '{
    "weather": "Cold",
    "mood": "Tired",
    "temperature": 8,
    "humidity": 70
  }' | json_pp
echo -e "\n"

# Test 7: Location-Based Recommendation (Delhi, India)
echo -e "${GREEN}Test 7: Location-Based Recommendation (Delhi, India)${NC}"
echo -e "${YELLOW}Note: This requires a valid OpenWeatherMap API key${NC}"
curl -s -X POST $BASE_URL/api/beverage/recommend-location \
  -H "Content-Type: application/json" \
  -d '{
    "latitude": 28.6139,
    "longitude": 77.2090,
    "mood": "Energetic"
  }' | json_pp
echo -e "\n"

# Test 8: Location-Based Recommendation (Mumbai, India)
echo -e "${GREEN}Test 8: Location-Based Recommendation (Mumbai, India)${NC}"
curl -s -X POST $BASE_URL/api/beverage/recommend-location \
  -H "Content-Type: application/json" \
  -d '{
    "latitude": 19.0760,
    "longitude": 72.8777,
    "mood": "Stressed"
  }' | json_pp
echo -e "\n"

# Test 9: Validation Error (Missing fields)
echo -e "${GREEN}Test 9: Validation Error (Missing fields)${NC}"
curl -s -X POST $BASE_URL/api/beverage/recommend \
  -H "Content-Type: application/json" \
  -d '{
    "weather": "Sunny"
  }' | json_pp
echo -e "\n"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Testing Complete!${NC}"
echo -e "${BLUE}========================================${NC}"
