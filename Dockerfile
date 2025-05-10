# Dockerfile
# This Dockerfile is designed for a full-stack application with an Angular frontend and a Node.js backend.
# It uses a multi-stage build to keep the final image lean.

# --- Stage 1: Build the Angular Frontend ---
    FROM node:18-alpine AS angular-builder
    LABEL stage="angular-builder"
    
    WORKDIR /app/angular-frontend
    
    # Copy package.json and package-lock.json (or npm-shrinkwrap.json)
    COPY angular-frontend/package.json ./
    COPY angular-frontend/package-lock.json ./
    
    # Install Angular dependencies
    RUN npm install
    
    # Copy the rest of the Angular application source code
    COPY angular-frontend/ ./
    
    # Build the Angular application for production
    # The output will be in /app/angular-frontend/dist/angular-frontend (or your project name)
    # Ensure your angular.json outputPath is "dist/angular-frontend" or adjust accordingly.
    ARG ANGULAR_PROJECT_NAME=angular-frontend
    RUN npm run build -- --configuration production --output-path=dist/${ANGULAR_PROJECT_NAME}
    
    # --- Stage 2: Setup Node.js Backend and Final Image ---
    FROM node:18-alpine AS production-server
    LABEL stage="production-server"
    
    ENV NODE_ENV=production
    
    WORKDIR /usr/src/app
    
    # Copy package.json and package-lock.json for the backend
    COPY node-backend/package.json ./
    COPY node-backend/package-lock.json ./
    
    # Install backend dependencies (production only)
    RUN npm install --omit=dev
    
    # Copy backend application code (server.js, routes, etc.)
    COPY node-backend/ ./
    
    # Copy the built Angular application from the 'angular-builder' stage
    # The server.js expects the Angular app at path.join(__dirname, 'dist', 'angular-frontend')
    # So, we copy the built frontend into 'dist/angular-frontend' relative to the backend code.
    ARG ANGULAR_PROJECT_NAME=angular-frontend
    COPY --from=angular-builder /app/angular-frontend/dist/${ANGULAR_PROJECT_NAME} ./dist/angular-frontend
    
    # Expose the port the app runs on (ensure this matches your server.js PORT)
    # Azure App Service for Containers will automatically use the port exposed here,
    # or you can set WEBSITES_PORT app setting.
    EXPOSE 5000
    # If your server.js uses process.env.PORT, Azure App Service will provide it.
    # EXPOSE 8080 (if your app listens on 8080 and you want to be explicit)
    
    
    # Command to run the application
    # This assumes your backend's package.json has a "start" script like "node server.js"
    # OR you can directly run node server.js
    CMD [ "node", "server.js" ]
    # Alternatively, if your package.json has a start script:
    # CMD [ "npm", "start" ]
    
    # Health check (optional, but good practice)
    # HEALTHCHECK --interval=30s --timeout=10s --start-period=1m \
    #   CMD curl -f http://localhost:${PORT:-5000}/ || exit 1
    # (Adjust the health check endpoint if you have one, e.g., /api/health)
    