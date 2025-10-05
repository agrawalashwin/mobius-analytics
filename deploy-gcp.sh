#!/bin/bash

# Mobius Analytics - GCP Cloud Run Deployment Script

set -e

# Configuration
PROJECT_ID="jobs-data-linkedin"
REGION="us-west1"
SERVICE_NAME="mobius-analytics"
REPO_NAME="mobius-analytics"
IMAGE_NAME="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO_NAME}/${SERVICE_NAME}"

echo "🚀 Deploying Mobius Analytics to GCP Cloud Run"
echo "================================================"
echo "Project: ${PROJECT_ID}"
echo "Region: ${REGION}"
echo "Service: ${SERVICE_NAME}"
echo "Image: ${IMAGE_NAME}"
echo ""

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ Error: gcloud CLI is not installed"
    echo "Please install it from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Set the project
echo "📋 Setting GCP project..."
gcloud config set project ${PROJECT_ID}

# Enable required APIs
echo "🔧 Enabling required APIs..."
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable artifactregistry.googleapis.com

# Create Artifact Registry repository if it doesn't exist
echo "📦 Creating Artifact Registry repository..."
gcloud artifacts repositories create ${REPO_NAME} \
  --repository-format=docker \
  --location=${REGION} \
  --description="Mobius Analytics Docker images" \
  2>/dev/null || echo "Repository already exists"

# Build the Docker image
echo "🏗️  Building Docker image..."
cd frontend
gcloud builds submit --tag ${IMAGE_NAME}

# Deploy to Cloud Run
echo "🚀 Deploying to Cloud Run..."
gcloud run deploy ${SERVICE_NAME} \
  --image ${IMAGE_NAME} \
  --platform managed \
  --region ${REGION} \
  --allow-unauthenticated \
  --memory 1Gi \
  --cpu 1 \
  --timeout 300 \
  --max-instances 10 \
  --min-instances 0 \
  --port 3000 \
  --set-env-vars "NODE_ENV=production" \
  --service-account="${PROJECT_ID}@appspot.gserviceaccount.com"

# Get the service URL
SERVICE_URL=$(gcloud run services describe ${SERVICE_NAME} --region ${REGION} --format 'value(status.url)')

echo ""
echo "✅ Deployment complete!"
echo "================================================"
echo "🌐 Service URL: ${SERVICE_URL}"
echo ""
echo "📊 View logs:"
echo "   gcloud run services logs read ${SERVICE_NAME} --region ${REGION}"
echo ""
echo "🔍 View service details:"
echo "   gcloud run services describe ${SERVICE_NAME} --region ${REGION}"
echo ""

