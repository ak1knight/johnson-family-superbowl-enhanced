#!/bin/bash

# AWS Amplify Setup Script for Johnson Family Super Bowl App
# This script helps automate the initial setup process

set -e

echo "🚀 AWS Amplify Setup for Johnson Family Super Bowl App"
echo "=================================================="
echo ""

# Check if AWS CLI is installed and configured
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed. Please install it first:"
    echo "   https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html"
    exit 1
fi

# Check AWS credentials
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS credentials not configured. Please run: aws configure"
    exit 1
fi

echo "✅ AWS CLI is configured"

# Get AWS account ID and region
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
REGION="us-west-1"

echo "📋 Account ID: $ACCOUNT_ID"
echo "📋 Region: $REGION"
echo ""

# Check if DynamoDB tables exist
echo "🔍 Checking DynamoDB tables..."

if aws dynamodb describe-table --table-name SuperBowlEntries --region $REGION &> /dev/null; then
    echo "✅ SuperBowlEntries table exists"
else
    echo "❌ SuperBowlEntries table not found in $REGION"
    echo "   Please ensure your DynamoDB tables are in the correct region"
fi

if aws dynamodb describe-table --table-name WinningEntry --region $REGION &> /dev/null; then
    echo "✅ WinningEntry table exists"
else
    echo "❌ WinningEntry table not found in $REGION"
    echo "   Please ensure your DynamoDB tables are in the correct region"
fi

echo ""

# Create IAM policy for Amplify (optional - can be done in console)
echo "🔧 Creating IAM policy for Amplify DynamoDB access..."

POLICY_NAME="AmplifyDynamoDBAccess-JohnsonSuperbowl"
POLICY_ARN="arn:aws:iam::$ACCOUNT_ID:policy/$POLICY_NAME"

# Check if policy already exists
if aws iam get-policy --policy-arn $POLICY_ARN &> /dev/null; then
    echo "✅ IAM policy already exists: $POLICY_NAME"
else
    # Create the policy
    if aws iam create-policy \
        --policy-name $POLICY_NAME \
        --policy-document file://aws-iam-policy.json \
        --description "DynamoDB access for Johnson Family Super Bowl Amplify app" &> /dev/null; then
        echo "✅ Created IAM policy: $POLICY_NAME"
    else
        echo "❌ Failed to create IAM policy. You can create it manually in the AWS Console."
    fi
fi

echo ""
echo "📝 Manual Steps Required:"
echo "========================"
echo ""
echo "1. 🌐 Go to AWS Amplify Console:"
echo "   https://console.aws.amazon.com/amplify/"
echo ""
echo "2. 📱 Create New App:"
echo "   - Click 'New App' → 'Host web app'"
echo "   - Choose 'GitHub' as source"
echo "   - Select repository: johnson-family-superbowl-enhanced"
echo "   - Choose branch: main"
echo ""
echo "3. ⚙️  Configure Environment Variables:"
echo "   AWS_REGION=us-west-1"
echo "   NODE_ENV=production"
echo "   SUPERBOWL_ENTRIES_TABLE=SuperBowlEntries"
echo "   WINNING_ENTRY_TABLE=WinningEntry"
echo ""
echo "4. 🔐 Attach IAM Policy to Amplify Service Role:"
echo "   - Go to IAM Console"
echo "   - Find Amplify service role (amplifyconsole-backend-role)"
echo "   - Attach policy: $POLICY_NAME"
echo ""
echo "5. 🌍 Configure Custom Domain (optional):"
echo "   - In Amplify Console → Domain management"
echo "   - Add domain: johnsonfamilysuperbowl.com"
echo ""
echo "6. ✅ Deploy and Test"
echo ""
echo "🎉 Setup complete! Your app should be ready for Amplify deployment."