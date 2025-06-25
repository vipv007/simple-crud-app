# Build stage
FROM node:18 AS builder
WORKDIR /app
COPY . .
RUN npm install && npm run build

# Production stage
FROM node:18-alpine
RUN npm install -g pm2
WORKDIR /home/site/wwwroot
COPY --from=builder /app/www/ .

EXPOSE 8080
CMD ["sh", "-c", "pm2 serve /home/site/wwwroot $PORT --spa --no-daemon"]
