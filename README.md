# Johnson Family Super Bowl Enhanced

A Next.js web application for managing a family Super Bowl betting pool with historical tracking and real-time scoring.

## Project Overview

The **Johnson Family Super Bowl Enhanced** application allows family members to submit predictions for Super Bowl games and tracks scores across multiple years (2020-2025). Users can place bets on prop questions, predict team scores, and compete for the best overall predictions.

## Key Features

- **Entry Form**: Submit predictions for Super Bowl prop bets, team scores, and tiebreakers
- **Big Board**: View all entries and scoring results in an organized table format
- **Prop Bet Board**: Track specific prop bet results and winners
- **Multi-year Support**: Access historical data from Super Bowls 2020-2025
- **AWS Integration**: Secure data storage using DynamoDB via SST framework
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS and DaisyUI

## Technical Stack

- **Frontend**: Next.js 15 with React 19, TypeScript
- **State Management**: MobX for reactive form state management
- **Styling**: Tailwind CSS with DaisyUI component library
- **Database**: AWS DynamoDB for scalable data storage
- **Deployment**: SST (Serverless Stack) on AWS infrastructure
- **Development Tools**: ESLint, TypeScript for code quality and type safety

## Getting Started

### Prerequisites
- Node.js 18+ installed
- AWS account configured for deployment
- SST CLI installed globally: `npm install -g sst`

### Local Development

1. Clone the repository:
```bash
git clone <repository-url>
cd johnson-family-superbowl-enhanced
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Deployment

Deploy to AWS using SST:

```bash
# Deploy to staging
sst deploy

# Deploy to production
sst deploy --stage production
```

## Project Structure

```
src/
├── app/
│   ├── components/     # Reusable UI components
│   ├── api/           # API routes for data operations
│   ├── big_board/     # Big board page and components
│   └── propbetboard/  # Prop bet board page
├── data/
│   ├── formdata.ts    # Question data and types
│   ├── form-context.ts # MobX store for form state
│   └── index.ts       # DynamoDB operations
```

## Contributing

1. Check the [`TODO.md`](TODO.md) file for current improvement opportunities
2. Create a feature branch for your changes
3. Follow TypeScript best practices and existing code style
4. Test your changes thoroughly before submitting

## License

Private family project - not for public distribution.
