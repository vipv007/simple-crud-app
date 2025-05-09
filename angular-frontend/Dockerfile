FROM node:18

WORKDIR /app
COPY . .

RUN npm install
RUN npm run build --configuration=production
RUN npm install -g http-server

# Serve using http-server from dist folder
CMD ["http-server", "dist/angular-frontend", "-p", "80"]
