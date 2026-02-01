# Johnson Family Super Bowl Enhanced

A Next.js web application for managing a family Super Bowl betting pool with historical tracking and real-time scoring.

## Project Overview

The **Johnson Family Super Bowl Enhanced** application allows family members to submit predictions for Super Bowl games and tracks scores across multiple years (2020-2025). Users can place bets on prop questions, predict team scores, and compete for the best overall predictions.

## Key Features

- **Entry Form**: Submit predictions for Super Bowl prop bets, team scores, and tiebreakers
- **Big Board**: View all entries and scoring results in an organized table format
- **Prop Bet Board**: Track specific prop bet results and winners
- **Multi-year Support**: Access historical data from Super Bowls 2020-2025
- **AWS Integration**: Secure data storage using DynamoDB with AWS SDK
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS and DaisyUI

## Technical Stack

- **Frontend**: Next.js 16 with React 19, TypeScript
- **State Management**: MobX for reactive form state management
- **Styling**: Tailwind CSS with DaisyUI component library
- **Database**: AWS DynamoDB for scalable data storage
- **Deployment**: AWS Amplify for simplified hosting and CI/CD
- **Development Tools**: ESLint, TypeScript for code quality and type safety

## Getting Started

### Prerequisites
- Node.js 18+ installed
- AWS account with configured credentials
- AWS CLI installed and configured: `aws configure`

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

3. Copy environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your local settings
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Deployment

Deploy to AWS using Amplify:

#### Quick Setup
```bash
# Run the setup script to check prerequisites
./amplify-setup.sh
```

#### Manual Setup
1. **Connect Repository**: Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/) and connect your GitHub repository
2. **Configure Build**: Amplify will automatically detect [`amplify.yml`](amplify.yml) configuration
3. **Set Environment Variables**: Configure AWS_REGION, NODE_ENV, and DynamoDB table names
4. **Deploy**: Push to main branch for automatic deployment

For detailed instructions, see [`deployment-guide.md`](deployment-guide.md)

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
