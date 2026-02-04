#!/usr/bin/env node

/**
 * Script to create a blank winning entry for Super Bowl 2026
 * This ensures the big board works properly by having a baseline entry to compare against
 */

const https = require('https');
const http = require('http');

// Super Bowl 2026 configuration
const YEAR = 2026;
const TEAMS = {
    home: { name: "Patriots", icon: "/images/ne.svg" },
    away: { name: "Seahawks", icon: "/images/sea.svg" }
};

const QUESTIONS_2026 = [
    {
        question: "How long will it take to sing the National Anthem?",
        short: "National Anthem",
        gamePhase: 'pre-game',
        config: { placeholder: "M:SS" }
    },
    {
        question: "What will the opening coin toss land on?",
        short: 'Coin Toss',
        gamePhase: 'pre-game',
        options: [{ name: "Heads", score: 75 }, { name: "Tails", score: 75 }]
    },
    {
        question: "Which team will score first?",
        short: 'First Score',
        gamePhase: 'q1',
        options: [{ name: "New England", score: 75, image: "/images/ne.svg" }, { name: "Seattle", score: 75, image: "/images/sea.svg" }]
    },
    {
        question: "What will be the first scoring play of the game?",
        short: 'First Scoring Play',
        gamePhase: 'q1',
        options: [
            { name: "Patriots Field Goal", score: 100, image: "/images/ne.svg" },
            { name: "Patriots Touchdown", score: 100, image: "/images/ne.svg" },
            { name: "Seahawks Field Goal", score: 100, image: "/images/sea.svg" },
            { name: "Seahawks Touchdown", score: 100, image: "/images/sea.svg" },
            { name: "Safety", score: 300 },
            { name: "Defensive/Special Teams TD", score: 200 }
        ]
    },
    {
        question: "Will there be a successful 2-point conversion in the game?",
        short: '2-Point Conversion',
        gamePhase: 'post-game',
        options: [{ name: "Yes", score: 150 }, { name: "No", score: 75 }]
    },
    {
        question: "Which will happen first in the game?",
        short: 'Sack or Interception',
        gamePhase: 'q1',
        options: [{ name: "Sack", score: 75 }, { name: "Interception", score: 125 }, { name: "Neither in Q1", score: 100 }]
    },
    {
        question: "What song will Bad Bunny perform first during the halftime show?",
        short: 'HT First Song',
        gamePhase: 'halftime',
        options: [
            { name: "Tití Me Preguntó/ALAMBRE PuA/La Mudanza", score: 100 },
            { name: "NUEVAYoL/DTmF/MONACO", score: 125 },
            { name: "Me Porto Bonito/BAILE INoLVIDABLE", score: 175 },
            { name: "I Like It/Efecto/VeLDA/LO QUE LE PASO HAWAii", score: 250 }
        ]
    },
    {
        question: "What color will be the dominant color of Bad Bunny's first outfit?",
        short: 'HT Outfit Color',
        gamePhase: 'halftime',
        options: [
            { name: "Black / White", score: 100 },
            { name: "Red", score: 100 },
            { name: "Blue", score: 125 },
            { name: "Metallic / Chrome / Silver", score: 125 },
            { name: "Neon / Multicolor", score: 150 }
        ]
    },
    {
        question: "Will either team score more than 14 points in a single quarter?",
        short: 'Big Quarter',
        gamePhase: 'post-game',
        options: [{ name: "Yes", score: 125 }, { name: "No", score: 100 }]
    },
    {
        question: "Will the game go to overtime?",
        short: 'Overtime',
        gamePhase: 'post-game',
        options: [{ name: "Yes", score: 400 }, { name: "No", score: 50 }]
    },
    {
        question: "What will be the margin of victory?",
        short: 'Margin of Victory',
        gamePhase: 'post-game',
        options: [
            { name: "1-3 points", score: 150 },
            { name: "4-7 points", score: 100 },
            { name: "8-14 points", score: 100 },
            { name: "15-21 points", score: 125 },
            { name: "22+ points", score: 175 }
        ]
    },
    {
        question: "Who will win Super Bowl LX MVP?",
        short: 'MVP',
        gamePhase: 'post-game',
        options: [
            { name: "Drake Maye (NE QB)", score: 100, image: "/images/dmaye.webp" },
            { name: "Sam Darnold (SEA QB)", score: 100, image: "/images/sdarnold.webp" },
            { name: "Kenneth Walker III (SEA RB)", score: 150, image: "/images/kwalker.webp" },
            { name: "Jaxon Smith-Njigba (SEA WR)", score: 150, image: "/images/jnjigba.webp" },
            { name: "Defensive Player or Other Offensive Player", score: 200, image: "/images/generic.png" },
            { name: "Kicker/Special Teams", score: 500, image: "/images/generic.png" }
        ]
    }
];

/**
 * Generate a blank winning entry structure for 2026
 * This creates an entry with all undefined values that can be updated later
 * Using undefined instead of 0 since 0 is a valid score that could trigger winner logic
 */
function generateBlankWinningEntry() {
    const entry = {
        // Basic entry info
        name: "BLANK_WINNING_ENTRY_2026",
        
        // Team scores - all undefined initially
        Patriots: {
            "Quarter 1": { score: undefined },
            "Quarter 2": { score: undefined },
            "Quarter 3": { score: undefined },
            "Final": { score: undefined },
            yards: undefined
        },
        Seahawks: {
            "Quarter 1": { score: undefined },
            "Quarter 2": { score: undefined },
            "Quarter 3": { score: undefined },
            "Final": { score: undefined },
            yards: undefined
        },
        
        // Quarter tiebreakers - all undefined initially
        "Quarter 1": { tiebreaker: undefined }, // Patriots Passing Yards
        "Quarter 2": { tiebreaker: undefined }, // Seahawks Rushing Yards
        "Quarter 3": { tiebreaker: undefined }, // Combined Penalty Yards
        "Final": { tiebreaker: undefined }
    };

    // Add question responses - all with first option or blank values
    QUESTIONS_2026.forEach((question, index) => {
        if (question.options) {
            // For questions with options, use the first option
            entry[index] = {
                ...question,
                response: question.options[0]
            };
        } else if (question.config?.placeholder === "M:SS") {
            // For time-based questions, use a default time
            entry[index] = {
                ...question,
                response: "2:00"
            };
        } else {
            // For text questions, use blank
            entry[index] = {
                ...question,
                response: ""
            };
        }
    });

    return entry;
}

/**
 * Make HTTP request to create the winning entry
 */
function makeRequest(hostname, port, path, data) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname,
            port,
            path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(JSON.stringify(data))
            }
        };

        const protocol = port === 443 ? https : http;
        const req = protocol.request(options, (res) => {
            let responseData = '';

            res.on('data', (chunk) => {
                responseData += chunk;
            });

            res.on('end', () => {
                try {
                    const parsed = JSON.parse(responseData);
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        resolve(parsed);
                    } else {
                        reject(new Error(`HTTP ${res.statusCode}: ${parsed.error || responseData}`));
                    }
                } catch (e) {
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        resolve(responseData);
                    } else {
                        reject(new Error(`HTTP ${res.statusCode}: ${responseData}`));
                    }
                }
            });
        });

        req.on('error', reject);
        req.write(JSON.stringify(data));
        req.end();
    });
}

/**
 * Main function to create the blank winning entry
 */
async function createBlankWinningEntry() {
    console.log(`🏈 Creating blank winning entry for Super Bowl ${YEAR}`);
    console.log(`📊 Teams: ${TEAMS.home.name} vs ${TEAMS.away.name}`);
    
    try {
        const blankEntry = generateBlankWinningEntry();
        
        console.log('\n📝 Generated blank entry structure:');
        console.log(`   - Name: ${blankEntry.name}`);
        console.log(`   - Team scores: All set to undefined`);
        console.log(`   - Questions: ${QUESTIONS_2026.length} answered with defaults`);
        console.log(`   - Tiebreakers: All set to undefined`);

        // Determine the API endpoint
        let hostname, port, protocol;
        if (process.env.NODE_ENV === 'production') {
            // For production, use your actual domain
            hostname = 'your-domain.com'; // Replace with actual domain
            port = 443;
            protocol = 'https';
        } else {
            // For local development
            hostname = 'localhost';
            port = 3000;
            protocol = 'http';
        }

        const path = `/api/winningentry/new/${YEAR}`;
        const data = { entry: blankEntry };

        console.log(`\n🚀 Attempting to create winning entry via ${protocol}://${hostname}:${port}${path}`);

        const response = await makeRequest(hostname, port, path, data);
        
        console.log('\n✅ Successfully created blank winning entry!');
        console.log('📋 Response:', response);
        console.log('\n🎯 The big board should now work correctly for 2026.');
        console.log('💡 You can update this entry later with actual game results.');

    } catch (error) {
        console.error('\n❌ Failed to create blank winning entry:');
        console.error('🔍 Error details:', error.message);
        
        if (error.message.includes('ECONNREFUSED')) {
            console.log('\n💡 Troubleshooting tips:');
            console.log('   1. Make sure your Next.js development server is running: npm run dev');
            console.log('   2. Check if the server is running on the correct port (3000)');
            console.log('   3. For production, update the hostname in this script');
        } else if (error.message.includes('HTTP 404')) {
            console.log('\n💡 API endpoint not found. Check that the winning entry API routes exist.');
        } else if (error.message.includes('HTTP 500')) {
            console.log('\n💡 Server error. Check the application logs and database connectivity.');
        }
        
        process.exit(1);
    }
}

/**
 * Alternative method: Generate JSON file for manual upload
 */
function generateJsonFile() {
    const blankEntry = generateBlankWinningEntry();
    const fs = require('fs');
    const path = require('path');
    
    const outputPath = path.join(__dirname, '..', `blank-winning-entry-${YEAR}.json`);
    
    fs.writeFileSync(outputPath, JSON.stringify({
        year: YEAR,
        entry: blankEntry
    }, null, 2));
    
    console.log(`📄 Blank winning entry JSON saved to: ${outputPath}`);
    console.log('📤 You can manually upload this via your admin interface or API tool.');
}

// Command line interface
if (require.main === module) {
    const args = process.argv.slice(2);
    
    if (args.includes('--json-only')) {
        console.log('📄 Generating JSON file only...');
        generateJsonFile();
    } else {
        createBlankWinningEntry().catch(() => {
            console.log('\n📄 Falling back to JSON file generation...');
            generateJsonFile();
        });
    }
}

module.exports = {
    generateBlankWinningEntry,
    createBlankWinningEntry,
    generateJsonFile,
    YEAR,
    TEAMS,
    QUESTIONS_2026
};