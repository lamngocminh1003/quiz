# Use the official Node.js image as the base image for building the app
FROM node:14 AS build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the application source code to the container
COPY . .

ENV NODE_ENV production
ENV VITE_NODE_ENV production
ENV VITE_BACKEND_URL http://146.190.89.3:8081

# Build the React app
RUN npm run build

# Use the official Nginx image as the base image for serving the app
FROM nginx:1.25.3-alpine-slim

COPY conf/default.conf /etc/nginx/conf.d

# Copy the built React app to the Nginx HTML root directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# The Nginx image by default starts Nginx when the container runs, so no need for an explicit CMD instruction

