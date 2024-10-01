# Use an official node image as the base image
FROM node:22-alpine as build

# Set the working directory
WORKDIR /app

# Copy the package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app
RUN npm run build

# Serve the built app using nginx
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

# Expose the port that the app runs on
EXPOSE 80
