# AWS Amplify Deployment Guide

## Overview
This guide walks through deploying the Johnson Family Super Bowl application to AWS Amplify, replacing the previous SST deployment.

## Prerequisites

### AWS Account Setup
1. **AWS CLI installed and configured**
   ```bash
   aws configure
   ```

2. **IAM User with Required Permissions**
   - `AmplifyFullAccess`
   - `DynamoDBFullAccess` (or specific table permissions)
   - `IAMFullAccess` (for role creation)

### Repository Setup
1. **Ensure your code is pushed to GitHub**
2. **Main branch should be deployment-ready**

## Step 1: Create Amplify Application

### Via AWS Console
1. Navigate to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Click "New App" → "Host web app"
3. Choose "GitHub" as source
4. Select your repository: `johnson-family-superbowl-enhanced`
5. Choose branch: `main` (or your preferred production branch)

### App Settings
- **App name**: `johnson-family-superbowl-enhanced`
- **Environment name**: `production` (or `main`)

## Step 2: Configure Build Settings

### Automatic Detection
Amplify should automatically detect Next.js and use the [`amplify.yml`](amplify.yml) configuration.

### Manual Configuration (if needed)
```yaml
version: 1
applications:
  - frontend:
      phases:
        preBuild:
          commands:
            - npm ci
        build:
          commands:
            - npm run build
      artifacts:
        baseDirectory: .next
        files:
          - '**/*'
      cache:
        paths:
          - node_modules/**/*
          - .next/cache/**/*
    appRoot: .
```

## Step 3: Environment Variables

Add these environment variables in Amplify Console → App Settings → Environment Variables:

### Production Environment Variables
```
AWS_REGION = us-west-1
NODE_ENV = production
SUPERBOWL_ENTRIES_TABLE = SuperBowlEntries
WINNING_ENTRY_TABLE = WinningEntry
```

### Optional Development Variables
```
LOCAL_DYNAMO_DB_ENDPOINT = (leave empty for production)
```

## Step 4: IAM Role Configuration

### Service Role for Amplify
Amplify will create a service role automatically, but you may need to add DynamoDB permissions:

1. Go to IAM Console
2. Find the Amplify service role (usually named `amplifyconsole-backend-role`)
3. Attach the following policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem",
        "dynamodb:Scan",
        "dynamodb:Query"
      ],
      "Resource": [
        "arn:aws:dynamodb:us-west-1:*:table/SuperBowlEntries",
        "arn:aws:dynamodb:us-west-1:*:table/WinningEntry"
      ]
    }
  ]
}
```

## Step 5: Domain Configuration

### Custom Domain Setup
1. In Amplify Console → App Settings → Domain management
2. Click "Add domain"
3. Enter: `johnsonfamilysuperbowl.com`
4. Configure DNS records as instructed by Amplify
5. SSL certificate will be automatically provisioned

### DNS Configuration
Update your domain's DNS settings to point to Amplify:
- Create CNAME record: `johnsonfamilysuperbowl.com` → `[amplify-domain].amplifyapp.com`

## Step 6: Deploy and Test

### Initial Deployment
1. Save all configurations
2. Amplify will automatically trigger the first build
3. Monitor build logs for any issues

### Testing Checklist
- [ ] Application loads at the Amplify URL
- [ ] Database connections work (test entry submission)
- [ ] Admin functionality works
- [ ] All pages render correctly
- [ ] Custom domain resolves (if configured)

## Step 7: Branch Strategy

### Production Branch
- **Branch**: `main`
- **Auto-deploy**: Enabled
- **Environment**: `production`

### Development/Staging (Optional)
- **Branch**: `develop` or `staging`
- **Auto-deploy**: Enabled
- **Environment**: `staging`
- **Domain**: `staging.johnsonfamilysuperbowl.com` (optional)

## Monitoring and Maintenance

### CloudWatch Integration
Amplify automatically creates CloudWatch logs for:
- Build logs
- Server-side rendering logs
- Access logs

### Performance Monitoring
- Built-in performance metrics in Amplify Console
- Core Web Vitals tracking
- Custom metrics can be added via CloudWatch

### Scaling
- Amplify automatically handles traffic scaling
- No configuration needed for typical usage patterns

## Troubleshooting

### Common Issues

#### Build Failures
1. Check Node.js version compatibility
2. Verify all dependencies are in [`package.json`](package.json)
3. Check build logs in Amplify Console

#### DynamoDB Connection Issues
1. Verify IAM permissions
2. Check region configuration (`us-west-1`)
3. Validate table names in environment variables

#### Domain Issues
1. Verify DNS propagation (can take 24-48 hours)
2. Check SSL certificate status
3. Ensure domain ownership verification is complete

### Logs Access
```bash
# View recent logs (if AWS CLI is configured)
aws logs describe-log-groups --log-group-name-prefix "/aws/amplify"
```

## Cost Optimization

### Amplify Pricing Components
- **Build minutes**: First 1000 minutes/month free
- **Storage**: First 5GB free, then $0.023/GB
- **Data transfer**: First 15GB free, then $0.15/GB

### Estimated Monthly Cost
- Small application: $0-10/month
- Medium traffic: $10-50/month
- High traffic: $50-200/month

Much lower than typical SST Lambda + CloudFront costs.

## Backup and Recovery

### DynamoDB
- Your existing DynamoDB tables remain unchanged
- Consider enabling Point-in-Time Recovery if not already enabled

### Application Code
- Source code backed up in GitHub
- Amplify maintains deployment history
- Easy rollback to previous versions

## Migration Checklist

- [x] Create [`amplify.yml`](amplify.yml)
- [x] Update [`package.json`](package.json) scripts
- [x] Update [`next.config.ts`](next.config.ts)
- [x] Create [`.env.example`](.env.example)
- [ ] Connect repository to Amplify
- [ ] Configure environment variables
- [ ] Set up IAM permissions
- [ ] Test staging deployment
- [ ] Configure custom domain
- [ ] Deploy to production
- [ ] Remove SST infrastructure

## Support Resources

- [AWS Amplify Documentation](https://docs.amplify.aws/javascript/)
- [Next.js on Amplify Guide](https://docs.amplify.aws/javascript/start/getting-started/hosting/)
- [DynamoDB SDK Documentation](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/dynamodb-examples.html)

## Next Steps

1. **Connect Repository**: Link your GitHub repo to Amplify
2. **Configure Environment**: Set up environment variables and IAM
3. **Test Deployment**: Deploy to staging first
4. **Domain Setup**: Configure custom domain
5. **Go Live**: Deploy to production and update DNS
6. **Cleanup**: Remove SST infrastructure after successful migration