FROM node:22-alpine

# Create app directory
WORKDIR /src/app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy the rest of the app
COPY . .

# Expose the Cloud Run port (8080)
EXPOSE 8080

# Start the app
CMD ["npm", "start"]
