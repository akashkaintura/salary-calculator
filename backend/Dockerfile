FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY backend/package*.json ./backend/

# Install dependencies
RUN cd backend && npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN cd backend && npm run build

# Expose port
EXPOSE 3000

# Start the application
WORKDIR /app/backend
CMD ["npm", "run", "start:prod"]
