#!/bin/bash

# Script to push salary-calculator to GitHub
# Usage: ./push-to-github.sh YOUR_GITHUB_USERNAME

if [ -z "$1" ]; then
    echo "❌ Error: Please provide your GitHub username"
    echo "Usage: ./push-to-github.sh YOUR_GITHUB_USERNAME"
    exit 1
fi

GITHUB_USERNAME=$1
REPO_NAME="salary-calculator"

echo "🚀 Setting up GitHub remote and pushing code..."
echo ""

# Check if remote already exists
if git remote get-url origin &>/dev/null; then
    echo "⚠️  Remote 'origin' already exists. Removing it..."
    git remote remove origin
fi

# Add remote
echo "📡 Adding GitHub remote..."
git remote add origin https://github.com/${GITHUB_USERNAME}/${REPO_NAME}.git

# Set branch to main
echo "🌿 Setting branch to main..."
git branch -M main

# Push to GitHub
echo "⬆️  Pushing to GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully pushed to GitHub!"
    echo "🔗 Repository URL: https://github.com/${GITHUB_USERNAME}/${REPO_NAME}"
else
    echo ""
    echo "❌ Failed to push. Make sure:"
    echo "   1. You've created the repository on GitHub: https://github.com/new"
    echo "   2. Repository name is: ${REPO_NAME}"
    echo "   3. You have the correct GitHub credentials"
fi

