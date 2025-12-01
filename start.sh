#!/bin/bash

# Color output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  🍹 Beverage Recommendation API${NC}"
echo -e "${BLUE}  Starting Server...${NC}"
echo -e "${BLUE}========================================${NC}\n"

cd /home/ankush/temp/acad/ai2

echo -e "${GREEN}Starting Node.js server...${NC}"
node server.js
