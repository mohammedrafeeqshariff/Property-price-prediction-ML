# Dockerfile
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install --production

# Copy app source
COPY . .

# Expose the app port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
