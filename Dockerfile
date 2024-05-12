FROM node:20.10.0

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy over the rest of the project
COPY . .

# Expose the port Strapi runs on
EXPOSE 1449

# Command to run Strapi
CMD ["node", "index.js"]