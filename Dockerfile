FROM node:24-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .
COPY .env.local .env.local

# Expose port
EXPOSE 3000

# Start the app in development mode
CMD ["npm", "run", "dev"]
