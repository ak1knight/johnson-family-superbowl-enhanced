#!/bin/bash

# Migration Verification Script
# Checks if all files are properly configured for Amplify migration

set -e

echo "🔍 Migration Verification Check"
echo "=============================="
echo ""

# Track verification status
ISSUES=0

# Check if required files exist
echo "📁 Checking required files..."

required_files=(
    "amplify.yml"
    ".env.example" 
    "deployment-guide.md"
    "migration-plan.md"
    "aws-iam-policy.json"
    "amplify-setup.sh"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file exists"
    else
        echo "❌ $file missing"
        ISSUES=$((ISSUES + 1))
    fi
done

echo ""

# Check package.json scripts
echo "📝 Checking package.json scripts..."

if grep -q '"dev": "next dev --turbopack"' package.json; then
    echo "✅ Development script updated"
else
    echo "❌ Development script not updated"
    ISSUES=$((ISSUES + 1))
fi

if grep -q '"sst"' package.json; then
    echo "❌ SST dependency still present"
    ISSUES=$((ISSUES + 1))
else
    echo "✅ SST dependency removed"
fi

echo ""

# Check Next.js config
echo "⚙️  Checking Next.js configuration..."

if grep -q "@aws-sdk/client-dynamodb" next.config.ts; then
    echo "✅ Next.js config updated for Amplify"
else
    echo "❌ Next.js config needs update"
    ISSUES=$((ISSUES + 1))
fi

if grep -q "standalone" next.config.ts; then
    echo "❌ SST-specific 'standalone' output still present"
    ISSUES=$((ISSUES + 1))
else
    echo "✅ SST-specific config removed"
fi

echo ""

# Check environment variables
echo "🔧 Checking environment configuration..."

if [ -f ".env.example" ]; then
    if grep -q "AWS_REGION=us-west-1" .env.example; then
        echo "✅ Environment template configured"
    else
        echo "❌ Environment template missing AWS region"
        ISSUES=$((ISSUES + 1))
    fi
else
    echo "❌ Environment template missing"
    ISSUES=$((ISSUES + 1))
fi

echo ""

# Check DynamoDB integration
echo "🗄️  Checking DynamoDB integration..."

if [ -f "src/data/index.ts" ]; then
    if grep -q "DynamoDBDocument" src/data/index.ts; then
        echo "✅ DynamoDB SDK integration intact"
    else
        echo "❌ DynamoDB integration may be broken"
        ISSUES=$((ISSUES + 1))
    fi
else
    echo "❌ DynamoDB service file missing"
    ISSUES=$((ISSUES + 1))
fi

echo ""

# Check if SST files are still present (warning, not error)
echo "🧹 Checking for legacy SST files..."

if [ -f "sst.config.ts" ]; then
    echo "⚠️  sst.config.ts still present (can be removed after successful migration)"
fi

if [ -f "sst-env.d.ts" ]; then
    echo "⚠️  sst-env.d.ts still present (can be removed after successful migration)"
fi

echo ""

# Final summary
echo "📊 Migration Readiness Summary"
echo "============================"

if [ $ISSUES -eq 0 ]; then
    echo "🎉 All checks passed! Ready for Amplify migration."
    echo ""
    echo "Next Steps:"
    echo "1. Run './amplify-setup.sh' to check AWS prerequisites"
    echo "2. Follow the deployment guide: deployment-guide.md"
    echo "3. Connect repository to AWS Amplify Console"
    echo ""
    exit 0
else
    echo "❌ $ISSUES issue(s) found. Please fix before proceeding."
    echo ""
    echo "Review the errors above and make necessary corrections."
    echo ""
    exit 1
fi