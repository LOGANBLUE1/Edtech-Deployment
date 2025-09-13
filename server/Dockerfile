FROM node:22-alpine
# Create app directory
WORKDIR /src/app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy the rest of the app
COPY . .

# App listens on port 4000 (Cloud Run requirement)
ENV PORT=4000
EXPOSE 4000

# Start the app
CMD ["npm", "run", "dev"]
