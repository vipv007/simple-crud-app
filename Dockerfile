# Stage 1: Build
FROM node:18 AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Stage 2: Serve
FROM node:18-alpine
RUN npm install -g pm2
WORKDIR /home/site/wwwroot
COPY --from=builder /app/dist/your-app-name/ .

EXPOSE 3000
CMD ["sh", "-c", "pm2 serve /home/site/wwwroot $PORT --spa --no-daemon"]
