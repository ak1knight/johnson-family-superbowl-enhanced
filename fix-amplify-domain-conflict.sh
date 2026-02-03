#!/bin/bash

# Amplify Domain Conflict Resolution Script
# Fixes CNAME conflicts when migrating from SST to Amplify

set -e

echo "🔍 Amplify Domain Conflict Resolution"
echo "===================================="
echo ""

DOMAIN="johnsonfamilysuperbowl.com"

# Check if AWS CLI is available
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed. Please install it first."
    exit 1
fi

echo "🔎 Checking for existing SSL certificates..."

# List existing certificates for the domain
CERTS=$(aws acm list-certificates --region us-east-1 --query "CertificateSummaryList[?DomainName=='$DOMAIN' || contains(SubjectAlternativeNameSummary, '$DOMAIN')]" --output table)

if [ -n "$CERTS" ] && [ "$CERTS" != "[]" ]; then
    echo "📋 Found existing certificates:"
    echo "$CERTS"
    echo ""
    echo "⚠️  This might be causing the CNAME conflict."
else
    echo "✅ No conflicting certificates found in us-east-1"
fi

echo ""
echo "🔎 Checking for CloudFront distributions..."

# Check for CloudFront distributions using this domain
CF_DISTROS=$(aws cloudfront list-distributions --query "DistributionList.Items[?contains(Aliases.Items, '$DOMAIN')]" --output table 2>/dev/null || echo "No access to CloudFront or no distributions found")

if [ "$CF_DISTROS" != "No access to CloudFront or no distributions found" ] && [ "$CF_DISTROS" != "[]" ]; then
    echo "📋 Found CloudFront distributions using this domain:"
    echo "$CF_DISTROS"
    echo ""
    echo "⚠️  You may need to remove the domain from these distributions first."
else
    echo "✅ No conflicting CloudFront distributions found"
fi

echo ""
echo "🔧 Resolution Steps:"
echo "==================="
echo ""

echo "📋 Option 1: Find and Remove Existing SSL Certificate"
echo "1. Go to ACM Console in us-east-1 region:"
echo "   https://console.aws.amazon.com/acm/home?region=us-east-1"
echo "2. Look for certificates containing '$DOMAIN'"
echo "3. Delete any unused certificates"
echo "4. Wait 5-10 minutes, then retry Amplify domain setup"
echo ""

echo "📋 Option 2: Check CloudFront Distributions"
echo "1. Go to CloudFront Console:"
echo "   https://console.aws.amazon.com/cloudfront/"
echo "2. Look for distributions using '$DOMAIN'"
echo "3. Remove the domain from alternate domain names (CNAMEs)"
echo "4. Wait for distribution update to complete"
echo "5. Retry Amplify domain setup"
echo ""

echo "📋 Option 3: Use AWS CLI to Find Conflicts"
echo "Run these commands to find all resources using your domain:"
echo ""
echo "# Check all regions for ACM certificates:"
for region in us-east-1 us-west-1 us-west-2 eu-west-1; do
    echo "aws acm list-certificates --region $region --query \"CertificateSummaryList[?contains(DomainName, '$DOMAIN') || contains(SubjectAlternativeNameSummary, '$DOMAIN')]\""
done
echo ""

echo "📋 Option 4: Temporarily Use Subdomain"
echo "If you need to move quickly:"
echo "1. Add domain as: www.$DOMAIN"
echo "2. Set up redirect from apex domain later"
echo "3. This avoids conflicts with apex domain certificates"
echo ""

echo "📋 Option 5: Force Remove via AWS Support"
echo "If stuck:"
echo "1. Contact AWS Support"
echo "2. Request manual removal of conflicting CNAME"
echo "3. Provide domain name and error details"
echo ""

echo "🎯 Most Likely Cause:"
echo "Your previous SST setup likely created an ACM certificate"
echo "that's still associated with '$DOMAIN'. Find and delete it"
echo "in the ACM console (us-east-1 region for CloudFront certs)."
echo ""

echo "⏰ After Resolution:"
echo "1. Wait 5-10 minutes after removing conflicts"
echo "2. Clear browser cache"
echo "3. Retry adding domain in Amplify Console"
echo "4. Domain should configure successfully"