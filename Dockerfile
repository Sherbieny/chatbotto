# Use the official Node.js image as a base
FROM node:latest

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) to the container
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of your project's files into the container
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "run", "dev"]
