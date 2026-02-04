# GitHub Workflows for AWS Amplify

This repository includes a comprehensive GitHub Actions pipeline optimized for AWS Amplify deployment of the Johnson Family Super Bowl Enhanced application.

## 🔄 Migration Status

The application has been **migrated from SST to AWS Amplify**. The workflows have been updated accordingly:

- ✅ **CI Pipeline** - Updated for Amplify build validation
- ✅ **Amplify Monitor** - New workflow for deployment monitoring  
- ✅ **Security Scan** - Enhanced with Amplify-specific checks
- 🚨 **Legacy Deploy** - Disabled (deployments now handled by Amplify)

## 📋 Active Workflows

The CI/CD pipeline consists of three main workflows:

1. **CI Pipeline** ([`ci.yml`](workflows/ci.yml)) - Continuous Integration with Amplify validation
2. **Amplify Monitor** ([`amplify-deploy.yml`](workflows/amplify-deploy.yml)) - Deployment monitoring and validation
3. **Security Scan** ([`security.yml`](workflows/security.yml)) - Security and compliance monitoring

## Workflow Details

### 1. CI Pipeline (`ci.yml`)

**Purpose**: Continuous Integration with Amplify build validation

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches

**Jobs:**
- **Lint and Build**: ESLint, TypeScript checking, Next.js build
- **Security Scan**: npm audit, sensitive file detection
- **Amplify Validation**: Validates [`amplify.yml`](../amplify.yml) and build artifacts
- **Test**: Application testing and startup validation

**Key Features:**
- Validates Amplify configuration before deployment
- Simulates Amplify build process
- Environment variable structure validation
- Build artifact verification

### 2. Amplify Deployment Monitor (`amplify-deploy.yml`)

**Purpose**: Monitors and validates Amplify deployments

**Triggers:**
- Push to `main` or `develop` branches (monitors automatic Amplify builds)
- Manual workflow dispatch for status checking

**Jobs:**
- **Pre-Deployment Validation**: Build validation before Amplify processes
- **Monitor Amplify Deployment**: Tracks deployment status via AWS CLI
- **Deployment Summary**: Creates comprehensive deployment reports

**Key Features:**
- Pre-validates builds before Amplify deploys
- Optional AWS CLI monitoring (requires credentials)
- Health checks post-deployment
- Environment-specific validation

### 3. Security Scan (`security.yml`)

**Purpose**: Comprehensive security scanning with Amplify-specific checks

**Triggers:**
- Daily schedule (2 AM UTC)
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches
- Manual workflow dispatch

**Jobs:**
- **Dependency Security Scan**: npm audit, vulnerability detection
- **License Compliance Check**: License validation
- **Outdated Packages**: Dependency freshness monitoring
- **CodeQL Analysis**: Static code security analysis
- **Dependency Review**: PR dependency changes analysis
- **Amplify Security Check**: Amplify-specific security validation

**Amplify Security Features:**
- Validates no sensitive files are committed
- Checks [`amplify.yml`](../amplify.yml) for security best practices
- Detects SST remnants requiring cleanup
- Validates AWS security configurations
- Prevents hardcoded credentials/regions

## 🔧 Configuration

### Repository Variables

Configure these in GitHub repository settings → Secrets and variables → Actions:

**Variables:**
```
AMPLIFY_APP_ID=<your-amplify-app-id>           # Required for deployment monitoring
AWS_REGION=us-west-1                           # AWS region (should match DynamoDB)
```

**Secrets** (Optional - for enhanced monitoring):
```
AWS_ACCESS_KEY_ID=<access-key>                 # For AWS CLI monitoring
AWS_SECRET_ACCESS_KEY=<secret-key>             # For AWS CLI monitoring
```

### Environment Protection Rules

Configure in GitHub repository settings → Environments:

- **production** - Requires approval, restricted to `main` branch
- **staging** - Automatic deployment from `develop` branch

### Branch Protection

Recommended settings for `main` branch:
- ✅ Require status checks (CI Pipeline)
- ✅ Require up-to-date branches
- ✅ Restrict pushes (use PRs)
- ✅ Require linear history

## 🚀 Deployment Process

### How Amplify Deployments Work

AWS Amplify handles deployments automatically when connected to your GitHub repository:

1. **Push to `develop`** → Amplify automatically builds staging environment
2. **Push to `main`** → Amplify automatically builds production environment  
3. **GitHub workflows** validate builds and monitor the deployment process

### Amplify Configuration

The deployment behavior is controlled by [`amplify.yml`](../amplify.yml):

```yaml
version: 1
applications:
  - frontend:
      phases:
        preBuild:
          commands:
            - nvm use 20
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
```

### Manual Workflow Execution

While deployments are automatic, you can manually run workflows:

1. **CI Pipeline**: Validate build before pushing
2. **Amplify Monitor**: Check current deployment status
3. **Security Scan**: Run security checks on-demand

## 📊 Monitoring Deployments

### GitHub Actions Dashboard
- Monitor workflow runs in the `Actions` tab
- View deployment summaries and health check results
- Check security scan reports

### AWS Amplify Console
- Real-time build progress: [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
- Build logs and error details
- Environment management and configuration

### Deployment URLs
- **Production**: `https://johnsonfamilysuperbowl.com` (or custom domain)
- **Staging**: `https://develop.[app-id].amplifyapp.com`

## 🧹 Post-Migration Cleanup

After confirming Amplify is working correctly, clean up SST-related files:

### 1. Remove Legacy Deploy Workflow
```bash
rm .github/workflows/deploy.yml  # After confirming disabled workflow works
```

### 2. Remove SST Configuration Files
```bash
rm sst.config.ts sst-env.d.ts
rm -rf .sst/ stacks/  # If these directories exist
```

### 3. Update package.json
Remove SST dependencies from [`package.json`](../package.json):
```bash
npm uninstall sst @serverless-stack/cli  # If these were installed
```

### 4. Clean up Environment Variables
- Remove `AWS_ROLE_ARN` and other SST-specific secrets from GitHub
- Ensure Amplify environment variables are configured in Amplify Console

## 🔍 Troubleshooting

### Common Issues

**Build Failures:**
- Check [`amplify.yml`](../amplify.yml) configuration syntax
- Verify Node.js version consistency (20.x)
- Review environment variables in Amplify Console
- Check build logs in Amplify Console

**Security Scan Failures:**
- Run `npm audit fix` for dependency vulnerabilities
- Remove any committed `.env` files
- Verify no hardcoded secrets in source code
- Update outdated dependencies

**Deployment Monitoring Issues:**
- Ensure `AMPLIFY_APP_ID` is set in repository variables
- Verify AWS credentials for CLI monitoring (optional)
- Check Amplify Console for detailed build status

**Legacy Deploy Workflow:**
- Workflow is intentionally disabled
- Remove after confirming Amplify deployments work
- Use Amplify Console for deployment management

### Health Check Failures

If post-deployment health checks fail:

1. **Wait for DNS propagation** (can take up to 10 minutes)
2. **Check Amplify build status** in AWS Console
3. **Verify custom domain configuration** if using one
4. **Test endpoints manually** to confirm functionality

## 📚 Additional Resources

### AWS Amplify
- [AWS Amplify Documentation](https://docs.amplify.aws/javascript/)
- [Amplify CLI Guide](https://docs.amplify.aws/cli/)
- [Next.js on Amplify](https://docs.amplify.aws/javascript/guides/nextjs/)

### GitHub Actions
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Workflow Syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)

### Migration Resources
- [Migration Plan](../migration-plan.md) - Detailed migration strategy
- [Post-Migration Checklist](../post-migration-checklist.md) - Verification steps
- [Deployment Guide](../deployment-guide.md) - New deployment instructions

## 🏷️ Workflow Status Badges

Add these badges to your main README to show workflow status:

```markdown
![CI Pipeline](https://github.com/your-username/johnson-family-superbowl-enhanced/actions/workflows/ci.yml/badge.svg)
![Amplify Monitor](https://github.com/your-username/johnson-family-superbowl-enhanced/actions/workflows/amplify-deploy.yml/badge.svg)
![Security Scan](https://github.com/your-username/johnson-family-superbowl-enhanced/actions/workflows/security.yml/badge.svg)
```

## 🎯 Best Practices for Amplify

### Development Workflow
1. **Feature Development**: Work on feature branches
2. **Testing**: Push to `develop` for staging deployment
3. **Production**: Merge to `main` only after staging validation
4. **Monitoring**: Use GitHub Actions and Amplify Console for oversight

### Security
1. **Environment Variables**: Configure in Amplify Console, not in code
2. **Branch Protection**: Protect `main` branch with required status checks
3. **Regular Scanning**: Monitor security scan results
4. **Dependency Updates**: Keep dependencies current

### Performance
1. **Build Caching**: Leverages Node modules and Next.js cache
2. **CDN**: Amplify provides built-in CloudFront distribution
3. **Environment Optimization**: Different configurations for staging/production

---

**Migration Complete**: This pipeline is optimized for AWS Amplify deployment. The legacy SST deployment system has been replaced with Amplify's automatic Git-based deployments.