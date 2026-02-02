#!/bin/bash

# Amplify Domain Role Fix Script
# Fixes the missing AWSAmplifyDomainRole error

set -e

echo "🔧 Fixing Amplify Domain Role Issue"
echo "=================================="
echo ""

# Check if AWS CLI is available
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed. Please install it first."
    exit 1
fi

# Get account ID
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
ROLE_NAME="AWSAmplifyDomainRole-Z19Z6I7HI77AT5"
TRUST_POLICY='{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "amplify.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}'

PERMISSIONS_POLICY='{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "acm:ListCertificates",
        "acm:RequestCertificate",
        "acm:DescribeCertificate",
        "acm:GetCertificate",
        "acm:DeleteCertificate",
        "acm:ResendValidationEmail",
        "acm:AddTagsToCertificate"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "route53:ListHostedZones",
        "route53:ChangeResourceRecordSets",
        "route53:GetHostedZone",
        "route53:ListResourceRecordSets",
        "route53:GetChange"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "iam:AttachRolePolicy",
        "iam:CreateRole",
        "iam:DeleteRole",
        "iam:DetachRolePolicy",
        "iam:GetRole",
        "iam:ListAttachedRolePolicies",
        "iam:PassRole"
      ],
      "Resource": "arn:aws:iam::*:role/AWSAmplifyDomain*"
    }
  ]
}'

echo "🔍 Checking if role exists..."

# Check if role already exists
if aws iam get-role --role-name $ROLE_NAME &> /dev/null; then
    echo "✅ Role $ROLE_NAME already exists"
else
    echo "📝 Creating role $ROLE_NAME..."
    
    # Create the role
    aws iam create-role \
        --role-name $ROLE_NAME \
        --assume-role-policy-document "$TRUST_POLICY" \
        --description "Service role for Amplify domain management"
    
    if [ $? -eq 0 ]; then
        echo "✅ Role created successfully"
    else
        echo "❌ Failed to create role"
        exit 1
    fi
fi

echo "🔐 Attaching permissions policy..."

# Create and attach the policy
POLICY_NAME="AmplifyDomainPolicy"
POLICY_ARN="arn:aws:iam::$ACCOUNT_ID:policy/$POLICY_NAME"

# Check if policy exists
if aws iam get-policy --policy-arn $POLICY_ARN &> /dev/null; then
    echo "✅ Policy already exists"
else
    echo "📝 Creating policy..."
    aws iam create-policy \
        --policy-name $POLICY_NAME \
        --policy-document "$PERMISSIONS_POLICY" \
        --description "Permissions for Amplify domain management"
fi

# Attach policy to role
aws iam attach-role-policy \
    --role-name $ROLE_NAME \
    --policy-arn $POLICY_ARN

echo "✅ Policy attached successfully"
echo ""
echo "🎉 Domain role setup complete!"
echo ""
echo "Next steps:"
echo "1. Wait 2-3 minutes for role propagation"
echo "2. Go back to Amplify Console"
echo "3. Try adding your custom domain again"
echo "4. If still failing, try deleting and re-adding the domain"
echo ""
echo "Note: It may take a few minutes for AWS to recognize the new role."