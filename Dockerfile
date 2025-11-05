# Use official Node.js image
FROM node:lts AS production

# Set working directory
WORKDIR /app

# Copy dependency files
COPY package.json package-lock.json ./

# Install all dependencies (you can change to --production if truly needed)
RUN npm install

# Copy the rest of the application
COPY . .

# Build the Next.js app
RUN npm run build

# Expose port
EXPOSE 3001

# Start the app in production mode
CMD ["npm", "start"]
