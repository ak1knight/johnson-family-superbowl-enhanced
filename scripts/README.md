# Scripts Directory

This directory contains utility scripts for the Johnson Family Super Bowl application.

## Create Blank Winning Entry for 2026

The [`create-blank-winning-entry-2026.js`](./create-blank-winning-entry-2026.js) script creates a blank winning entry for the 2026 Super Bowl to ensure the big board displays correctly.

### Usage

#### Option 1: Using npm scripts (recommended)

```bash
# Create blank winning entry via API (requires server to be running)
npm run create-blank-winning-entry

# Generate JSON file only (no API call)
npm run create-blank-winning-entry:json
```

#### Option 2: Direct node execution

```bash
# Create blank winning entry via API
node scripts/create-blank-winning-entry-2026.js

# Generate JSON file only
node scripts/create-blank-winning-entry-2026.js --json-only
```

### What it does

The script creates a blank winning entry with:
- **Name**: `BLANK_WINNING_ENTRY_2026`
- **Team scores**: All set to `undefined` (Patriots vs Seahawks)
- **Questions**: 12 questions answered with default values
- **Tiebreakers**: All set to `undefined`

### Why undefined instead of 0?

Using `undefined` instead of `0` is important because:
- `0` is a valid score that could trigger winner calculation logic
- `undefined` clearly indicates "no data available yet"
- Prevents false positives in the scoring system

### Super Bowl 2026 Details

- **Teams**: New England Patriots vs Seattle Seahawks
- **Date**: February 8, 2026
- **Halftime Show**: Bad Bunny
- **Questions**: 12 prop bet questions covering pre-game, quarters, halftime, and post-game

### Troubleshooting

If the API call fails, the script will automatically generate a JSON file instead. Common issues:

1. **ECONNREFUSED**: Make sure your Next.js dev server is running (`npm run dev`)
2. **HTTP 404**: Check that the winning entry API routes exist
3. **HTTP 500**: Check server logs and database connectivity

For production deployment, update the hostname in the script from `localhost` to your actual domain.

### File Output

When using `--json-only` flag, the script generates:
- **File**: `blank-winning-entry-2026.json` (in project root)
- **Format**: JSON object with `year` and `entry` properties
- **Usage**: Can be manually uploaded via admin interface or API tools