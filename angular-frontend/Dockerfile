# # Stage 1: Build Angular app
# FROM node:18 AS builder

# WORKDIR /app
# COPY package*.json ./
# RUN npm install
# COPY . .
# RUN npm run build --prod

# # Stage 2: Serve using http-server
# FROM node:18-alpine

# WORKDIR /app
# RUN npm install -g http-server

# COPY --from=builder /app/dist/angular-frontend /app

# EXPOSE 8080
# CMD ["http-server", ".", "-p", "8080"]
