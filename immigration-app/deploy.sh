#!/bin/bash
echo "🚀 Deploying Immigration CRM to Vercel..."

if ! command -v vercel &> /dev/null; then
    npm install -g vercel
fi

vercel --prod
