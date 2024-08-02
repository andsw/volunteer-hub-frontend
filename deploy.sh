#!/bin/bash

# Print a message indicating the start of the deployment process
echo "Starting deployment process..."

# Build the React project
echo "Running 'npm run build'..."
npm run build

# Deploy to Google Cloud Storage
echo "Uploading build files to Google Cloud Storage..."
gsutil rsync -r build gs://volunteer-hub-a54d8.appspot.com

# Print a message indicating the end of the upload process
echo "Upload completed."

# Deploy to Firebase Hosting
echo "Deploying to Firebase Hosting..."
firebase deploy --only hosting

# Print a message indicating the end of the deployment process
echo "Deployment process completed."
