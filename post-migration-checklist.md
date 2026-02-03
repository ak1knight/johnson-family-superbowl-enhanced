# Post-Migration Checklist

## Complete Migration Steps

After successfully migrating from SST to AWS Amplify, follow this checklist to ensure everything is properly set up and cleaned up.

## ✅ Pre-Migration (Completed)

- [x] Analyze current SST setup and DynamoDB usage
- [x] Research AWS alternatives for Next.js hosting
- [x] Create migration plan document
- [x] Implement chosen alternative solution
- [x] Update deployment configuration
- [x] Test new deployment approach
- [x] Update documentation and scripts

## 🚀 Migration Execution

### Phase 1: AWS Amplify Setup
- [ ] Run `./amplify-setup.sh` to verify AWS prerequisites
- [ ] Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
- [ ] Create new app → Host web app
- [ ] Connect GitHub repository: `johnson-family-superbowl-enhanced`
- [ ] Select branch: `main`
- [ ] Verify [`amplify.yml`](amplify.yml) is detected automatically

### Phase 2: Configuration
- [ ] Set environment variables in Amplify Console:
  - `AWS_REGION = us-west-1`
  - `NODE_ENV = production`
  - `SUPERBOWL_ENTRIES_TABLE = SuperBowlEntries`
  - `WINNING_ENTRY_TABLE = WinningEntry`
- [ ] Configure IAM role with DynamoDB permissions using [`aws-iam-policy.json`](aws-iam-policy.json)
- [ ] Set up custom domain: `johnsonfamilysuperbowl.com`

### Phase 3: Testing & Verification
- [ ] First deployment completes successfully
- [ ] Application loads without errors
- [ ] Test DynamoDB connectivity:
  - [ ] View existing entries on Big Board
  - [ ] Submit a test entry
  - [ ] Access admin functionality
- [ ] Performance check (should be faster than SST)
- [ ] Custom domain resolves correctly

### Phase 4: Production Cutover
- [ ] Update DNS to point to Amplify
- [ ] Monitor application for 24 hours
- [ ] Verify all functionality works as expected
- [ ] Performance meets or exceeds previous setup

## 🧹 Post-Migration Cleanup

### Remove SST Infrastructure
Once Amplify is confirmed working:

```bash
# Remove SST infrastructure (BE CAREFUL!)
# Only run this after Amplify is fully working
# sst remove --stage production
```

### Clean Up Repository
- [ ] Remove SST-specific files:
  ```bash
  rm sst.config.ts
  rm sst-env.d.ts
  ```
- [ ] Remove SST from package.json dependencies (already done)
- [ ] Update .gitignore to remove SST entries (already done)
- [ ] Commit all migration changes to git

### Update Team Documentation
- [ ] Update any internal documentation
- [ ] Share new deployment process with team
- [ ] Update any CI/CD processes that referenced SST

## 📊 Success Metrics

### Performance Improvements
- [ ] Faster cold start times (no Lambda cold starts)
- [ ] Better global distribution via CloudFront
- [ ] Reduced deployment complexity

### Cost Savings
- [ ] Monitor AWS billing for 1-2 months
- [ ] Expected savings: 40-60% reduction in hosting costs
- [ ] No more Lambda function charges

### Operational Benefits
- [ ] Simpler deployment process (git push)
- [ ] Better monitoring via Amplify Console
- [ ] Easier environment management

## 🆘 Rollback Plan

If issues arise after migration:

### Immediate Rollback
1. **DNS Change**: Update DNS to point back to old infrastructure
2. **Keep SST Running**: Don't remove SST until 100% confident
3. **Data Integrity**: DynamoDB data remains unchanged throughout

### Troubleshooting Common Issues

#### Build Failures
- Check Node.js version (20+) in Amplify build settings
- Verify all dependencies are in package.json
- Check build logs in Amplify Console

#### DynamoDB Access Issues
- Verify IAM permissions are correctly attached
- Check environment variables are set correctly
- Ensure region matches (us-west-1)

#### Domain Issues
- Allow 24-48 hours for DNS propagation
- Verify SSL certificate is issued
- Check domain ownership verification

## 📞 Support Resources

- **AWS Amplify Docs**: https://docs.amplify.aws/javascript/
- **Next.js on Amplify**: https://docs.amplify.aws/javascript/start/getting-started/hosting/
- **Migration Guide**: [`deployment-guide.md`](deployment-guide.md)
- **Setup Script**: [`amplify-setup.sh`](amplify-setup.sh)
- **Verification**: [`verify-migration.sh`](verify-migration.sh)

## 🎉 Migration Complete!

Once all items are checked off:
- [ ] Application running successfully on AWS Amplify
- [ ] All functionality verified working
- [ ] Performance meets expectations
- [ ] Team trained on new deployment process
- [ ] SST infrastructure safely removed
- [ ] Documentation updated

**Estimated Total Migration Time**: 4-8 hours
**Expected Cost Savings**: 40-60% monthly reduction
**Performance Improvement**: Faster load times, better reliability