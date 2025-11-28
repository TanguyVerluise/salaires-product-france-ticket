#!/bin/bash

# Script de démarrage pour Railway
echo "🚂 Starting Railway deployment..."

# Vérifier si la base de données existe
if [ ! -f "data/salaries.db" ]; then
  echo "📊 Database not found, seeding..."
  npm run seed
else
  echo "✅ Database already exists"
fi

# Démarrer l'application
echo "🚀 Starting Next.js..."
npm start
