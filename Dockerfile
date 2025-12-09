# Build stage using Alpine linux
FROM node:20-alpine AS build
WORKDIR /app

# Copy package files (dependency files)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all React codes
COPY . .

# Build the frontend
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy React built files to replace Nginx defualt page
COPY --from=build /app/build /usr/share/nginx/html

# Listens on port 80
EXPOSE 80
# Make Nginx PID=1
CMD ["nginx", "-g", "daemon off;"]