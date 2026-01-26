# TODO: Improvement Suggestions

This document outlines suggested improvements for the Johnson Family Super Bowl Enhanced application, organized by priority and category.

## 🔧 Code Quality & Structure

### High Priority

- [ ] **Remove Dead Code**: Clean up [`src/app/components/nav.tsx`](src/app/components/nav.tsx:64) - remove large blocks of commented Bootstrap code

- [ ] **Fix TypeScript Issues**: 
  - [ ] [`src/data/form-context.ts`](src/data/form-context.ts:8) - Replace sparse arrays with `Array(4).fill(undefined)`
  - [ ] [`src/data/index.ts`](src/data/index.ts:74) - Fix mixed SDK methods (`.update()`, `.get()`) with DynamoDBDocument commands

- [ ] **Improve Error Handling**: Add try-catch blocks and proper error responses in API routes
  ```typescript
  // Example for API routes
  try {
    const entry = (await req.json()).entry;
    await data.createEntry(entry);
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
  ```

### Medium Priority

- [ ] **Standardize Imports**: Ensure consistent import ordering and grouping
- [ ] **Add JSDoc Comments**: Document complex functions and types
- [ ] **Extract Constants**: Move magic numbers and strings to configuration files

## 🎨 User Experience

### High Priority

- [ ] **Update Metadata**: Fix [`src/app/layout.tsx`](src/app/layout.tsx:24) - replace default "Create Next App" title and description with project-specific information

- [ ] **Add Loading States**: Implement loading indicators for:
  - [ ] Form submission
  - [ ] Data fetching on Big Board
  - [ ] API calls

- [ ] **Enhanced Form Validation**: 
  - [ ] Add specific error messages for each field type
  - [ ] Real-time validation feedback
  - [ ] Better UX for required fields

### Medium Priority

- [ ] **Mobile Optimization**: 
  - [ ] Reduce title size (text-9xl) for mobile screens
  - [ ] Improve touch targets for mobile users
  - [ ] Test responsive design on various devices

- [ ] **Accessibility Improvements**:
  - [ ] Add proper ARIA labels
  - [ ] Improve keyboard navigation
  - [ ] Add focus indicators

## 🏗️ Architecture Improvements

### High Priority

- [ ] **Environment Configuration**: 
  - [ ] Move hardcoded year (2025) to environment variables
  - [ ] Add configuration for DynamoDB table names
  - [ ] Configure AWS region through environment

- [ ] **API Consistency**: 
  - [ ] Standardize API response formats across all endpoints
  - [ ] Add proper HTTP status codes
  - [ ] Implement consistent error response structure

### Medium Priority

- [ ] **Data Layer Separation**: Create a proper service layer
  ```typescript
  // Example structure
  class SuperBowlService {
    async createEntry(entry: Entry): Promise<{ success: boolean; id?: number }> {
      // Implementation with proper error handling
    }
  }
  ```

- [ ] **Type Safety Improvements**:
  - [ ] Add runtime validation for API inputs
  - [ ] Strengthen type definitions for database operations

## 🔒 Security & Performance

### High Priority

- [ ] **Input Sanitization**: Add validation for user inputs, especially in [`src/app/components/entryform.tsx`](src/app/components/entryform.tsx:87)

- [ ] **Dependency Cleanup**: 
  - [ ] Remove duplicate AWS SDK versions (keep only v3)
  - [ ] Evaluate if MobX is necessary for simple form state
  - [ ] Audit and remove unused dependencies

### Medium Priority

- [ ] **Image Optimization**: 
  - [ ] Use Next.js Image component for player photos
  - [ ] Optimize team logos and images
  - [ ] Implement proper image caching

- [ ] **Performance Monitoring**:
  - [ ] Add bundle size analysis
  - [ ] Implement performance metrics
  - [ ] Optimize initial page load

## 🧪 Testing & Documentation

### High Priority

- [ ] **Add Testing Framework**: 
  - [ ] Set up Jest and React Testing Library
  - [ ] Add unit tests for form validation
  - [ ] Add integration tests for API endpoints

- [ ] **API Documentation**: 
  - [ ] Document all API endpoints
  - [ ] Add request/response examples
  - [ ] Include error response documentation

### Medium Priority

- [ ] **Component Documentation**: 
  - [ ] Add Storybook for component documentation
  - [ ] Document component props and usage

- [ ] **Deployment Documentation**:
  - [ ] Add detailed setup instructions
  - [ ] Document environment variables
  - [ ] Add troubleshooting guide

## 🎯 Feature Enhancements

### Future Considerations

- [ ] **Real-time Updates**: 
  - [ ] Consider WebSocket integration for live score updates
  - [ ] Real-time leaderboard updates during games

- [ ] **Admin Dashboard Expansion**: 
  - [ ] Enhanced admin functionality for managing entries
  - [ ] Bulk operations for updating scores
  - [ ] User management features

- [ ] **Historical Analytics**: 
  - [ ] Add charts showing family member performance over years
  - [ ] Statistical analysis of betting patterns
  - [ ] Performance trends and insights

- [ ] **Export Functionality**: 
  - [ ] PDF export of results
  - [ ] Excel export for detailed analysis
  - [ ] Print-friendly views

- [ ] **Enhanced Prop Betting**:
  - [ ] Dynamic prop bet creation
  - [ ] Custom scoring systems
  - [ ] Multi-game support beyond Super Bowl

## 🚀 Deployment & DevOps

### Medium Priority

- [ ] **CI/CD Pipeline**: 
  - [ ] Set up GitHub Actions for automated testing
  - [ ] Automated deployment on merge to main
  - [ ] Environment-specific deployments

- [ ] **Monitoring & Logging**:
  - [ ] Add application monitoring
  - [ ] Implement structured logging
  - [ ] Set up error tracking (e.g., Sentry)

- [ ] **Database Improvements**:
  - [ ] Add database migrations system
  - [ ] Implement data backup strategy
  - [ ] Add database indexing optimization

---

## Priority Legend
- **High Priority**: Should be addressed in the next development cycle
- **Medium Priority**: Important improvements for future releases
- **Future Considerations**: Nice-to-have features for long-term roadmap

## Contributing
When working on items from this TODO list:
1. Create a feature branch for each improvement
2. Update this file to reflect completed items
3. Add appropriate tests for new functionality
4. Update documentation as needed