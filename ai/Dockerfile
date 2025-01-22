# Use Node.js LTS version
FROM node:20-slim

# Create app directory
WORKDIR /usr/src/app/ai

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Copy env file
COPY .env.example .env

# Command to run the bot
CMD ["npm", "run", "bot"] 