# GitHub Actions CI/CD Pipeline

This repository includes a comprehensive GitHub Actions CI/CD pipeline for automated testing, security scanning, and deployment of the Johnson Family Super Bowl Enhanced application.

## Overview

The CI/CD pipeline consists of three main workflows:

1. **CI Pipeline** ([`ci.yml`](.github/workflows/ci.yml)) - Continuous Integration
2. **Deployment** ([`deploy.yml`](.github/workflows/deploy.yml)) - Automated deployments
3. **Security Scan** ([`security.yml`](.github/workflows/security.yml)) - Security and dependency monitoring

## Workflows

### 1. CI Pipeline (`ci.yml`)

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches

**Jobs:**
- **Lint and Build**: ESLint, TypeScript checking, and Next.js build
- **Security Scan**: npm audit for vulnerabilities
- **Test**: Application testing and build verification

**Features:**
- Matrix testing on Node.js 18.x and 20.x
- Build artifact caching
- Automated build startup testing

### 2. Deployment (`deploy.yml`)

**Triggers:**
- Push to `main` (production) or `develop` (staging) branches
- Manual workflow dispatch with stage selection

**Jobs:**
- **Deploy**: Deploy to AWS using SST
- **Cleanup**: Remove old deployments (production only)

**Features:**
- Environment-specific deployments (staging/production)
- AWS credential configuration
- Post-deployment health checks
- Manual deployment controls

### 3. Security Scan (`security.yml`)

**Triggers:**
- Daily schedule (2 AM UTC)
- Push to `main` branch
- Pull requests to `main` branch
- Manual workflow dispatch

**Jobs:**
- **Dependency Scan**: npm audit for security vulnerabilities
- **License Scan**: License compliance checking
- **Outdated Packages**: Dependency update monitoring
- **CodeQL Analysis**: Static code analysis
- **Dependency Review**: PR-specific dependency analysis

## Setup Requirements

### 1. Repository Secrets

Configure the following secrets in your GitHub repository (`Settings > Secrets and variables > Actions`):

```
AWS_ACCESS_KEY_ID       # AWS access key for deployment
AWS_SECRET_ACCESS_KEY   # AWS secret key for deployment
```

### 2. Repository Variables

Configure the following variables (optional):

```
AWS_REGION             # AWS region (defaults to us-east-1)
```

### 3. Environment Configuration

Set up GitHub environments for deployment protection:

1. Go to `Settings > Environments`
2. Create environments:
   - `staging` - for develop branch deployments
   - `production` - for main branch deployments

3. Configure protection rules for production:
   - Required reviewers
   - Wait timer
   - Deployment branches (restrict to `main`)

## AWS Configuration

### Prerequisites

1. **AWS Account**: Ensure you have an AWS account set up
2. **SST Configuration**: Verify [`sst.config.ts`](sst.config.ts) is properly configured
3. **IAM Permissions**: The AWS credentials must have permissions for:
   - CloudFormation stack management
   - Lambda function deployment
   - DynamoDB table access
   - S3 bucket access (for static assets)
   - Other services used by your SST application

### SST Deployment

The deployment workflow uses SST (Serverless Stack) for infrastructure management:

- **Staging**: `npx sst deploy --stage staging`
- **Production**: `npx sst deploy --stage production`

## Workflow Features

### Build Optimization

- **Dependency Caching**: npm cache is preserved between runs
- **Build Artifacts**: Compiled Next.js build is cached and reused
- **Matrix Testing**: Tests run on multiple Node.js versions

### Security Features

- **Vulnerability Scanning**: Automated npm audit checks
- **License Compliance**: Monitors package licenses
- **CodeQL Analysis**: GitHub's security scanning
- **Dependency Review**: Automatic security review for PRs

### Deployment Features

- **Environment Isolation**: Separate staging and production deployments
- **Health Checks**: Post-deployment verification
- **Manual Controls**: Ability to trigger deployments manually
- **Cleanup**: Automated removal of old resources

## Usage

### Automatic Deployments

- **Staging**: Push to `develop` branch
- **Production**: Push to `main` branch

### Manual Deployments

1. Go to `Actions` tab in GitHub
2. Select `Deploy` workflow
3. Click `Run workflow`
4. Choose stage and options
5. Click `Run workflow`

### Monitoring

Monitor workflow runs in the `Actions` tab:

- ✅ **Success**: All checks passed
- ❌ **Failure**: Check logs for details
- 🟡 **In Progress**: Workflow currently running

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check ESLint errors: `npm run lint`
   - Verify TypeScript: `npx tsc --noEmit`
   - Test local build: `npm run build`

2. **Deployment Failures**
   - Verify AWS credentials are configured
   - Check SST configuration in [`sst.config.ts`](sst.config.ts)
   - Ensure AWS permissions are sufficient

3. **Security Scan Failures**
   - High/critical vulnerabilities: Run `npm audit fix`
   - License issues: Review package licenses
   - Outdated packages: Consider updating dependencies

### Getting Help

1. Check workflow logs in GitHub Actions
2. Review error messages and stack traces
3. Verify configuration files and secrets
4. Test commands locally before pushing

## Customization

### Adding Tests

When you add tests to your project, update the test job in [`ci.yml`](.github/workflows/ci.yml):

```yaml
- name: Run tests
  run: npm test  # Replace the echo command with this
```

### Modifying Security Rules

Adjust security thresholds in [`security.yml`](.github/workflows/security.yml):

- Change audit level: `--audit-level=high`
- Modify license restrictions
- Add custom security checks

### Environment Configuration

Customize deployment environments:

- Add new stages in [`deploy.yml`](.github/workflows/deploy.yml)
- Configure different AWS regions
- Add environment-specific variables

## Best Practices

1. **Branch Protection**: Enable branch protection rules for `main`
2. **Required Checks**: Make CI workflow required for merges
3. **Security Monitoring**: Review security scan results regularly
4. **Dependency Updates**: Keep dependencies updated
5. **Environment Isolation**: Use different AWS accounts for staging/production

## Workflow Status Badges

Add these badges to your README to show workflow status:

```markdown
![CI](https://github.com/your-username/johnson-family-superbowl-enhanced/actions/workflows/ci.yml/badge.svg)
![Deploy](https://github.com/your-username/johnson-family-superbowl-enhanced/actions/workflows/deploy.yml/badge.svg)
![Security](https://github.com/your-username/johnson-family-superbowl-enhanced/actions/workflows/security.yml/badge.svg)