# Smallest version of node
FROM node:22.0.0-alpine

# Creating the app directory
WORKDIR /app

# Copying the package relates file to new app
COPY package*.json ./

# Install dependencies in new app dir
RUN npm install

# Copy all other file to new app
COPY . .

# Expose the port
EXPOSE 9000

# Run command
CMD [ "node", "server.js" ]