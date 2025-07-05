# Use official Node.js image
FROM node:24-alpine

# Set working directory
WORKDIR /app

# Copy package.json and lockfile
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY . .

# Build Next.js frontend
RUN npm run build

# Expose frontend port
EXPOSE 3000

# Start Next.js server
CMD ["npm", "start"]
