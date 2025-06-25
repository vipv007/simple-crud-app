# Stage 1: Build Angular app
FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build --prod

# Stage 2: Serve using pm2 in Azure
FROM node:18-slim

# Install pm2 globally
RUN npm install -g pm2

# Azure expects content to be in /home/site/wwwroot
WORKDIR /home/site/wwwroot

# Copy built Angular app from builder stage
COPY --from=builder /app/dist/<your-angular-app-folder> .

# Default port is injected by Azure via the PORT env var
ENV PM2_SERVE_PATH=/home/site/wwwroot
ENV PM2_SERVE_PORT=$PORT

# Start PM2 to serve Angular SPA
CMD ["sh", "-c", "pm2 serve $PM2_SERVE_PATH $PM2_SERVE_PORT --spa --no-daemon"]
