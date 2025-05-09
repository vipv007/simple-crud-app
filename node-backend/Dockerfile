FROM node:18

WORKDIR /app
COPY . .

RUN npm install
RUN npm run build --configuration=production

# Install Express again just to be safe
RUN npm install express mongoose cors

COPY server.js .

EXPOSE 5000
CMD ["node", "server.js"]
