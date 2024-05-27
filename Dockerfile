# Use a lightweight Node.js base image with Node.js 12.22.9
FROM node:12.22.9-slim

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available) to the working directory
COPY package.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the port your app is listening on (80 in this case)
EXPOSE 8080

# Define the command to start your Node.js application
CMD ["node", "server.js"]
