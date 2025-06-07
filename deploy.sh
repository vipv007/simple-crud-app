#!/bin/bash

# Set Azure environment variables
export AZURE_APP_NAME="CelesContainerWebApp"
export RESOURCE_GROUP="CelesBricks"
export AZURE_REGION="West US 3"
export APP_SERVICE_PLAN="ASP-CelesBricks-bc87 (P1v2: 1)"
export DATABASE_CONNECTION_STRING="mongodb+srv://vip:venkat123@cluster0.twvburi.mongodb.net/crudapp?retryWrites=true&w=majority&appName=Cluster0"

# 1. Build the Angular frontend
cd frontend
npm install
ng build --configuration production

# 2. Move the built Angular files to the backend directory
cd ../backend
mkdir -p dist
cp -r ../frontend/dist/angular-frontend ./dist/ 

# 3. Install dependencies for the Node.js backend
npm install

# 4. Deploy to Azure App Service
echo "Deploying to Azure..."
az webapp up --name $AZURE_APP_NAME --resource-group $RESOURCE_GROUP --plan $APP_SERVICE_PLAN --location $AZURE_REGION

# 5. Set up MongoDB connection string in Azure App Service
az webapp config connection-string set \
  --name $AZURE_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --settings MONGODB_URI=$DATABASE_CONNECTION_STRING \
  --connection-string-type MongoDB

echo "Deployment complete!"

# Optionally, open the app URL after deployment
az webapp browse --name $AZURE_APP_NAME --resource-group $RESOURCE_GROUP
