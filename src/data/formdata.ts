export enum TeamName {
    Chiefs = "Chiefs",
    Buccaneers = "Buccaneers",
    "49ers" = "49ers",
    Rams = "Rams",
    Bengals = "Bengals",
    Eagles = "Eagles",
    Patriots = "Patriots",
    Seahawks = "Seahawks"
}

export type Team = {
    name:TeamName,
    icon:string
};

type Option = {
    name: string,
    score: number,
    image?: string,
    embed?: string
}

export type Question = {
    question: string,
    short: string,
    extrainfo?: string,
    config?: {placeholder: string},
    options?: Option[],
    gamePhase?: 'pre-game' | 'q1' | 'q2' | 'halftime' | 'q3' | 'q4' | 'post-game'
}

export type AnsweredQuestion = Question & {
    response: string | Option
}

type Year = readonly [Team, Team]

export const teams:{[year: string]: Year} = { 
    "2020": [{ name: TeamName.Chiefs, icon: "/images/kc.svg" }, { name: TeamName["49ers"], icon: "/images/sf.svg" }], 
    "2021": [{ name: TeamName.Chiefs, icon: "/images/kc.svg" }, { name: TeamName.Buccaneers, icon: "/images/tb.svg" }],
    "2022": [{ name: TeamName.Rams, icon: "/images/la.svg" }, { name: TeamName.Bengals, icon: "/images/cin.svg" }],
    "2023": [{ name: TeamName.Chiefs, icon: "/images/kc.svg" }, { name: TeamName.Eagles, icon: "/images/phi.svg" }],
    "2024": [{ name: TeamName.Chiefs, icon: "/images/kc.svg" }, { name: TeamName["49ers"], icon: "/images/sf.svg" }],
    "2025": [{ name: TeamName.Chiefs, icon: "/images/kc.svg" }, { name: TeamName.Eagles, icon: "/images/phi.svg" }],
    "2026": [{ name: TeamName.Patriots, icon: "/images/ne.svg" }, { name: TeamName.Seahawks, icon: "/images/sea.svg" }],
} as const;

// Super Bowl dates configuration
export const superBowlDates: Record<string, string> = {
    "2020": "February 2, 2020",
    "2021": "February 7, 2021",
    "2022": "February 13, 2022",
    "2023": "February 12, 2023",
    "2024": "February 11, 2024",
    "2025": "February 9, 2025",
    "2026": "February 8, 2026",
};

export const periodNames = ["Quarter 1", "Quarter 2", "Quarter 3", "Final"] as const;
export type PeriodName = typeof periodNames[number];

// Improved TeamScore type with better structure
export type TeamScore = {
    [K in PeriodName]: {
        score: number;
    };
} & {
    yards: number;
};

// Type for quarter tiebreaker data
export type QuarterTiebreaker = {
    tiebreaker: number;
};

// More type-safe Entry interface
export type Entry = {
    // Dynamic team scores based on TeamName enum
    [K in TeamName]?: TeamScore;
} & {
    // Quarter tiebreakers
    [K in PeriodName]: QuarterTiebreaker;
} & {
    // Required fields
    name: string;
} & {
    // Question responses - using index signatures for dynamic questions
    [index: number]: AnsweredQuestion;
};

// Helper type for creating entries with better type safety
export type EntryData = {
    homeTeam: TeamName;
    awayTeam: TeamName;
    homeTeamScore: TeamScore;
    awayTeamScore: TeamScore;
    tiebreakers: [number, number, number, number];
    name: string;
    questionAnswers: AnsweredQuestion[];
};

export const tiebreakers: Record<string, Record<string, string>> = {
    "2021": {"Quarter 1": "Chiefs Passing Yards", "Quarter 2": "Buccaneers Rushing Yards", "Quarter 3": "Combined Penalty Yards"},
    "2022": {"Quarter 1": "Bengals Passing Yards", "Quarter 2": "Rams Rushing Yards", "Quarter 3": "Combined Penalty Yards"},
    "2023": {"Quarter 1": "Eagles Passing Yards", "Quarter 2": "Chiefs Rushing Yards", "Quarter 3": "Combined Penalty Yards"},
    "2024": {"Quarter 1": "Chiefs Passing Yards", "Quarter 2": "49ers Rushing Yards", "Quarter 3": "Combined Penalty Yards"},
    "2025": {"Quarter 1": "Chiefs Passing Yards", "Quarter 2": "Eagles Rushing Yards", "Quarter 3": "Combined Penalty Yards"},
    "2026": {"Quarter 1": "Patriots Passing Yards", "Quarter 2": "Seahawks Rushing Yards", "Quarter 3": "Combined Penalty Yards"}
}

// Lazy loading and memoization imports
import { memoizeWithLRU } from '../utils/performance';

// Memoized helper functions for team data access with error handling
export const getTeamsForYear = memoizeWithLRU((year: string): Year => {
    const teamData = teams[year];
    if (!teamData) {
        throw new Error(`No team data found for year: ${year}. Available years: ${Object.keys(teams).join(', ')}`);
    }
    return teamData;
}, 50, (year) => year);

export const getTeamByIndex = memoizeWithLRU((year: string, index: 0 | 1): Team => {
    try {
        const yearTeams = getTeamsForYear(year);
        return yearTeams[index];
    } catch (error) {
        throw new Error(`Failed to get team at index ${index} for year ${year}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}, 100, (year, index) => `${year}-${index}`);

export const getHomeTeam = memoizeWithLRU((year: string): Team => {
    return getTeamByIndex(year, 0);
}, 50, (year) => `home-${year}`);

export const getAwayTeam = memoizeWithLRU((year: string): Team => {
    return getTeamByIndex(year, 1);
}, 50, (year) => `away-${year}`);

export const getQuestionsForYear = memoizeWithLRU((year: string): Question[] => {
    const questionData = questions[year];
    if (!questionData) {
        throw new Error(`No questions found for year: ${year}. Available years: ${Object.keys(questions).join(', ')}`);
    }
    return questionData;
}, 20, (year) => `questions-${year}`);

export const getTiebreakersForYear = memoizeWithLRU((year: string): Record<string, string> => {
    const tiebreakerData = tiebreakers[year];
    if (!tiebreakerData) {
        throw new Error(`No tiebreakers found for year: ${year}. Available years: ${Object.keys(tiebreakers).join(', ')}`);
    }
    return tiebreakerData;
}, 20, (year) => `tiebreakers-${year}`);

export const getTiebreakerForQuarter = memoizeWithLRU((year: string, quarter: PeriodName): string => {
    try {
        const yearTiebreakers = getTiebreakersForYear(year);
        const tiebreaker = yearTiebreakers[quarter];
        if (!tiebreaker) {
            throw new Error(`No tiebreaker found for quarter: ${quarter} in year: ${year}`);
        }
        return tiebreaker;
    } catch (error) {
        throw new Error(`Failed to get tiebreaker for quarter ${quarter} in year ${year}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}, 100, (year, quarter) => `${year}-${quarter}`);

// Memoized validation helpers
export const isValidYear = memoizeWithLRU((year: string): boolean => {
    return year in teams;
}, 50, (year) => year);

export const isValidTeamName = memoizeWithLRU((teamName: string): teamName is TeamName => {
    return Object.values(TeamName).includes(teamName as TeamName);
}, 50, (teamName) => teamName);

export const isValidPeriodName = memoizeWithLRU((period: string): period is PeriodName => {
    return periodNames.includes(period as PeriodName);
}, 20, (period) => period);

// Memoized year utilities for better performance
export const getAvailableYears = memoizeWithLRU((): string[] => {
    return Object.keys(teams).sort();
}, 1, () => 'available-years');

export const getCurrentYear = (): string => {
    return new Date().getFullYear().toString();
};

export const getLatestAvailableYear = memoizeWithLRU((): string => {
    const years = getAvailableYears();
    return years[years.length - 1];
}, 1, () => 'latest-available-year');

// Performance optimized question filtering
export const getQuestionsByType = memoizeWithLRU((year: string, hasOptions: boolean): Question[] => {
    const allQuestions = getQuestionsForYear(year);
    return allQuestions.filter(q => hasOptions ? !!q.options : !q.options);
}, 40, (year, hasOptions) => `${year}-${hasOptions ? 'options' : 'text'}`);

// Batch data loading utility
export const getBatchData = memoizeWithLRU((year: string) => {
    return {
        teams: getTeamsForYear(year),
        questions: getQuestionsForYear(year),
        tiebreakers: getTiebreakersForYear(year),
        homeTeam: getHomeTeam(year),
        awayTeam: getAwayTeam(year)
    };
}, 10, (year) => `batch-${year}`);

export const questions: Record<string, Question[]> = {
    "2020": [
        {
            question: "How long will it take Demi Lovato to sing the National Anthem?",
            short: "National Anthem",
            extrainfo: `Demi Lovato is no stranger to singing the anthem at huge sporting events, you can find many examples on YouTube.
        Her most recent high-profile anthem performance came during the Conor McGregor-Floyd Mayweather boxing match in 2016, where she took 2:12.
        She also sang for Game 4 of the 2015 World Series between the New York Mets and Kansas City Royals, where she clocked out at 1:58 and even held the “brave” for a few seconds to milk the clock.
        The past two super bowls have both gone under 2 minutes.`,
            config: {
                placeholder: "M:SS"
            }
        },
        {
            question: "Will any scoring drive take less time than it takes Demi Lovato to sing the national anthem?",
            short: 'Drive vs. Anthem',
            extrainfo: "Kansas City had 31% of their scoring drives last less than 2:15, while San Francisco had 28%",
            options: [{ name: "Yes", score: 300 }, { name: "No", score: 100 }]
        },
        {
            question: "What will the opening coin toss land on?",
            short: 'Coin Toss',
            extrainfo: 'Since the first Super Bowl, HEADS has come up 25 times and TAILS 28. The winner of the Super Bowl has won the coin toss 24 times with HEADS coming up 12 times.',
            options: [{ name: "Heads", score: 100 }, { name: "Tails", score: 100 }]
        },
        {
            question: "Which commercial will be shown first, Mountain Dew or Toyota?",
            short: 'Mtn. Dew vs Toyota',
            options: [{ name: "Mountain Dew", score: 150 }, { name: "Toyota", score: 150 }]
        },
        {
            question: "Which commercial will be shown first, Audi or Porsche?",
            short: 'Audi vs Porsche',
            options: [{ name: "Audi", score: 150 }, { name: "Porsche", score: 150 }]
        },
        {
            question: "Which commercial will be shown first, Donald Trump or Michael Bloomberg?",
            short: 'Trump vs Bloomberg',
            options: [{ name: "Trump", score: 150 }, { name: "Bloomberg", score: 150 }]
        },
        {
            question: "What will the the first scoring play of the game be?",
            short: 'First Scoring Play',
            options: [{ name: "Chiefs Field Goal", score: 200, image: "/images/kc.svg" }, { name: "Chiefs Offensive TD", score: 200, image: "/images/kc.svg" }, { name: "Chiefs Defensive TD", score: 600, image: "/images/kc.svg" }, { name: "49ers Field Goal", score: 200, image: "/images/sf.svg" }, { name: "49ers Offensive TD", score: 200, image: "/images/sf.svg" }, { name: "49ers Defensive TD", score: 600, image: "/images/sf.svg" }]
        },
        {
            question: "Which will be higher?",
            short: 'James Harden',
            extrainfo: 'James Harden has averaged 36 points per game for the Houston Rockets so far this season. San Francisco has avaraged 15 points per half, while Kansas City has averaged 14.',
            options: [{ name: "James Harden Total Points vs the New Orleans Pelicans", score: 100 }, { name: "Total points scored in the first half by both teams", score: 300 }]
        },
        {
            question: "What song will be sung first during the halftime show?",
            short: 'HT Opening Song',
            options: [
                { name: "Whenever, Wherever (Shakira)", score: 300, embed: "https://www.youtube.com/embed/weRHyjj34ZE" },
                { name: "Let's Get Loud (J-Lo)", score: 400, embed: "https://www.youtube.com/embed/Q91hydQRGyM" },
                { name: "On The Floor (J-Lo)", score: 500, embed: "https://www.youtube.com/embed/t4H_Zoh7G5A" },
                { name: "Dare (Shakira)", score: 600, embed: "https://www.youtube.com/embed/XkYAxGt-aUs" },
                { name: "Live It Up (J-Lo)", score: 650, embed: "https://www.youtube.com/embed/BofL1AaiTjo" },
                { name: "Other", score: 500 }
            ]
        },
        {
            question: "Will Pitbull Make an Appearance During the Halftime Show?",
            short: 'Pitbull',
            options: [{ name: "Yes", score: 100 }, { name: "No", score: 300 }]
        },
        {
            question: "What will the last score of the game be?",
            short: 'Last Score',
            options: [{ name: "Touchdown", score: 150 }, { name: "Field Goal or Safety", score: 200 }]
        },
        {
            question: "Who will win Super Bowl LIV MVP?",
            short: 'MVP',
            options: [
                { name: "Patrick Mahomes (KC QB)", image: "/images/mahomes.png", score: 110 }, 
                { name: "Jimmy Garoppolo (SF QB)", image: "/images/garoppolo.png", score: 200 }, 
                { name: "Raheem Mostert (SF RB)", image: "/images/mostert.png", score: 500 }, 
                { name: "Tyreek Hill (KC WR)", image: "/images/hill.png", score: 1600 }, 
                { name: "Travis Kelce (KC TE)", image: "/images/kelce.png", score: 1600 }, 
                { name: "Other", image: "/images/other.png", score: 1200 }
            ]
        }
    ],
    "2021": [
        
        {
            question: "How long will it take Eric Church and Jazmine Sullivan to sing the National Anthem?",
            short: "National Anthem",
            extrainfo: `For just the second time in the history of the big game the Star Spangled Banner will be a duet with Jazmine Sullivan and Eric Church.
        Jazmine Sullivan has sung the Anthem for sporting events on a couple of occasions, both clocking in well under 2 minutes. Eric Church, meanwhile, has not performed the song previously.
        Having a duet also brings a new wrinkle to predicting the song length and it's not clear how the two singers will split the responsibility.
        The only other anthem duet with Aretha Franklin and Aaron Neville went a longer 2:10 with both singers trading lines.
        The anthem has been shorter than 2 minutes for 3 straight super bowls after a string of 2+ minute performances.`,
            config: {
                placeholder: "M:SS"
            }
        },
        {
            question: "What will the opening coin toss land on?",
            short: 'Coin Toss',
            extrainfo: 'Since the first Super Bowl, HEADS has come up 25 times and TAILS 28. The winner of the Super Bowl has won the coin toss 24 times with HEADS coming up 12 times.',
            options: [{ name: "Heads", score: 100 }, { name: "Tails", score: 100 }]
        },
        {
            question: "What will the the first play of the game be?",
            short: 'First Play',
            options: [{ name: "Run", score: 85 }, { name: "Pass", score: 100 }]
        },
        {
            question: "Which team will score first?",
            short: 'First Score',
            options: [{ name: "Kansas City", score: 90, image: "/images/kc.svg" }, { name: "Tampa Bay", score: 100, image: "/images/tb.svg" }]
        },
        {
            question: "What will be mentioned first?",
            short: 'Tom Brady',
            extrainfo: 'Excludes halftime and commercials.',
            options: [{ name: "Tom Brady's Age (43)", score: 105 }, { name: "Tom Brady’s 10th Super Bowl", score: 90 }]
        },
        {
            question: "What will happen to the price of Bitcoin during the Super Bowl?",
            short: 'Bitcoin',
            extrainfo: 'Bet is on the Price at the beggining of the game compared to the price at games end, bitcoinaverage.com will be used to settle disputes.',
            options: [{ name: "Price of Bitcoin goes up", score: 90 }, { name: "Price of Bitcoin goes down", score: 100 }]
        },
        {
            question: "What song will be sung first during the halftime show?",
            short: 'HT Opening Song',
            extrainfo: 'Warning: Music videos may contain explicit content',
            options: [
                { name: "Starboy", score: 225, embed: "https://www.youtube.com/embed/34Na4j8AVgA" },
                { name: "Blinding Lights", score: 250, embed: "https://www.youtube.com/embed/4NRXx6U8ABQ" },
                { name: "Can't Feel My Face", score: 265, embed: "https://www.youtube.com/embed/KEI4qSrkPAs" },
                { name: "In Your Eyes", score: 275, embed: "https://www.youtube.com/embed/dqRZDebPIGs" },
                { name: "Other", score: 250 }
            ]
        },
        {
            question: "Will Ariana Grande be on stage during the halftime show?",
            short: 'Ariana Grande',
            extrainfo: `The Weeknd is featured in "Off the Table" from Ariana Grande's latest album, released in October`,
            options: [{ name: "Yes", score: 205 }, { name: "No", score: 80 }]
        },
        {
            question: "Will Any TD Be Overturned By Replay?",
            short: 'Replay',
            extrainfo: 'In 2018 49% of all plays challenged by coaches were overturned. In the NFL all scoring plays are automatically reviewed by replay officials without needing to be challenged.',
            options: [{ name: "Yes", score: 140 }, { name: "No", score: 90 }]
        },
        {
            question: "Who will win Puppy Bowl XVII?",
            short: 'Puppy Bowl',
            options: [{ name: "Team Fluff", score: 100 }, { name: "Team Ruff", score: 100 }]
        },
        {
            question: "Who will win Super Bowl LV MVP?",
            short: 'MVP',
            options: [
                { name: "Patrick Mahomes (KC QB)", image: "/images/mahomes2.webp", score: 95 }, 
                { name: "Tom Brady (TB QB)", image: "/images/brady.webp", score: 150 }, 
                { name: "Other", score: 200 }
            ]
        }
    ],
    "2022": [
        
        {
            question: "How long will it take Mickey Guyton to sing the National Anthem?",
            short: "National Anthem",
            extrainfo: `Oddsmakers in Vegas predict the anthem to go for 1:46, which would be the shortest since Kelly Clarkson's 1:34 for Super Bowl 46. 
            In that 10 year span, 7 anthem renditions have exceeded 2 minutes in length, including last year's duet of Jazmine Sullivan and Eric Church which went a whopping 2:17.
            The longest anthem time of the past 15 years, however, belongs to Alicia Keys, who sang for 2:36 in 2013`,
            config: {
                placeholder: "M:SS"
            }
        },
        {
            question: "What will the opening coin toss land on?",
            short: 'Coin Toss',
            extrainfo: 'Since the first Super Bowl, HEADS has come up 25 times and TAILS 28. The winner of the Super Bowl has won the coin toss 24 times with HEADS coming up 12 times.',
            options: [{ name: "Heads", score: 100 }, { name: "Tails", score: 100 }]
        },
        {
            question: "Which will happen first in the game?",
            short: 'Sack or TD',
            options: [{ name: "Sack", score: 90 }, { name: "Touchdown", score: 100 }]
        },
        {
            question: "Which team will score first?",
            short: 'First Score',
            options: [{ name: "Cincinnati", score: 100, image: "/images/cin.svg" }, { name: "Los Angeles", score: 100, image: "/images/la.svg" }]
        },
        {
            question: "Which company's commercial will play first?",
            short: 'Commercial',
            options: [{ name: "Meta (Facebook)", score: 90, image: 'images/meta.svg' }, { name: "Amazon Prime", score: 110, image: 'images/amazon_prime.svg' }, { name: "Google", score: 110, image: 'images/google.svg' }]
        },
        {
            question: "What will happen to the price of Bitcoin during the Super Bowl?",
            short: 'Bitcoin',
            extrainfo: 'Bet is on the Price at the beggining of the game compared to the price at games end, bitcoinaverage.com will be used to settle disputes.',
            options: [{ name: "Price of Bitcoin goes up", score: 100 }, { name: "Price of Bitcoin goes down", score: 100 }]
        },
        {
            question: "Which artist will perform first during the halftime show?",
            short: 'HT Opening Artist',
            options: [
                { name: "Mary J Blige", score: 125 },
                { name: "Kendrick Lamar", score: 150 },
                { name: "Snoop Dogg", score: 175 },
                { name: "Dr. Dre", score: 200 },
                { name: "Eminem", score: 225 }
            ]
        },
        {
            question: "What will Eminem wear on his head during the halftime show?",
            short: 'Eminem',
            options: [{ name: "Nothing", score: 110 }, { name: "Hat", score: 125 }, { name: "Hood", score: 150 }, { name: "Do Rag or Bandana", score: 160 }]
        },
        {
            question: "Will there be a fourth quarter comeback?",
            short: 'Comeback',
            options: [{ name: "Yes", score: 140 }, { name: "No", score: 60 }]
        },
        {
            question: "Will the team who scores first win the game?",
            short: 'First Score Wins',
            options: [{ name: "Yes", score: 85 }, { name: "No", score: 115 }]
        },
        {
            question: "Who will win Super Bowl LVI MVP?",
            short: 'MVP',
            options: [
                { name: "Matthew Stafford (LAR QB)", image: "/images/stafford.webp", score: 110 }, 
                { name: "Joe Burrow (CIN QB)", image: "/images/burrow.webp", score: 150 }, 
                { name: "Cooper Kupp (LAR WR)", image: "/images/kupp.webp", score: 200 },
                { name: "Aaron Donald (LAR DE)", image: "/images/donald.webp", score: 400 },
                { name: "Other", score: 200 }
            ]
        }
    ],
    "2023": [
        
        {
            question: "How long will it take Chris Stapleton to sing the National Anthem?",
            short: "National Anthem",
            extrainfo: `Neil Diamond holds the record for the quickest rendition of the national anthem in Super Bowl history. He raced through The Star-Spangled Banner 
                in just 1 minute and 2 seconds at Super Bowl 21. By contrast, it took Alicia Keys 2 minutes and 36 seconds at Super Bowl 47. The average time now stands 
                at 1 minute and 43 seconds.`,
            config: {
                placeholder: "M:SS"
            }
        },
        {
            question: "What will the opening coin toss land on?",
            short: 'Coin Toss',
            extrainfo: 'Since the first Super Bowl, HEADS has come up 25 times and TAILS 28. The winner of the Super Bowl has won the coin toss 24 times with HEADS coming up 12 times.',
            options: [{ name: "Heads", score: 100 }, { name: "Tails", score: 100 }]
        },
        {
            question: "Which will happen first in the game?",
            short: 'Sack or TD',
            options: [{ name: "Sack", score: 90 }, { name: "Touchdown", score: 100 }]
        },
        {
            question: "Which team will score first?",
            short: 'First Score',
            options: [{ name: "Philadelphia", score: 100, image: "/images/phi.svg" }, { name: "Kansas City", score: 100, image: "/images/kc.svg" }]
        },
        {
            question: "Which company's commercial will play first?",
            short: 'Commercial',
            options: [{ name: "Meta (Facebook)", score: 90, image: 'images/meta.svg' }, { name: "Amazon Prime", score: 110, image: 'images/amazon_prime.svg' }, { name: "Google", score: 110, image: 'images/google.svg' }]
        },
        {
            question: "What will be the number of the player who scores the first touchdown?",
            short: 'TD Number',
            options: [{ name: "11 or lower", score: 100 }, { name: "12 or higher", score: 100 }]
        },
        {
            question: "Which artist will make a guest appearance with Rihanna during the halftime show?",
            short: 'HT Guest Artist',
            extrainfo: "If multiple artists appear, points will be given the first artist that appears (besides other)",
            options: [
                { name: "Jay-Z", score: 100 },
                { name: "Calvin Harris", score: 100 },
                { name: "Drake", score: 100 },
                { name: "A$AP Rocky", score: 150 },
                { name: "None/Other", score: 200 }
            ]
        },
        {
            question: "What color will Rihanna be wearing for her last song?",
            short: 'HT Color',
            options: [{ name: "Black", score: 100 }, { name: "White", score: 150 }, { name: "Grey/Silver", score: 150 }, { name: "Other", score: 150 }]
        },
        {
            question: "Will there be a fourth quarter comeback?",
            short: 'Comeback',
            options: [{ name: "Yes", score: 140 }, { name: "No", score: 60 }]
        },
        {
            question: "Will the team who scores first win the game?",
            short: 'First Score Wins',
            options: [{ name: "Yes", score: 85 }, { name: "No", score: 115 }]
        },
        {
            question: "Who will win Super Bowl LVII MVP?",
            short: 'MVP',
            options: [
                { name: "Patrick Mahomes (KC QB)", image: "/images/mahomes2.webp", score: 120},
                { name: "Jalen Hurts (PHI QB)", image: "/images/hurts.webp", score: 125 },
                { name: "Other", score: 200 }
            ]
        }
    ],
    "2024": [

    ],
    "2025": [
        {
            question: "How long will it take Jon Batiste to sing the National Anthem?",
            short: "National Anthem",
            gamePhase: 'pre-game',
            extrainfo: `Neil Diamond holds the record for the quickest rendition of the national anthem in Super Bowl history. He raced through The Star-Spangled Banner
                in just 1 minute and 2 seconds at Super Bowl 21. By contrast, it took Alicia Keys 2 minutes and 36 seconds at Super Bowl 47. The average time now stands
                at 1 minute and 43 seconds.`,
            config: {
                placeholder: "M:SS"
            }
        },
        {
            question: "What will the opening coin toss land on?",
            short: 'Coin Toss',
            gamePhase: 'pre-game',
            extrainfo: 'Since the first Super Bowl, HEADS has come up 25 times and TAILS 28. The winner of the Super Bowl has won the coin toss 24 times with HEADS coming up 12 times.',
            options: [{ name: "Heads", score: 100 }, { name: "Tails", score: 100 }]
        },
        {
            question: "Which will happen first in the game?",
            short: 'Sack or TD',
            gamePhase: 'q1',
            options: [{ name: "Sack", score: 90 }, { name: "Touchdown", score: 100 }]
        },
        {
            question: "Which team will score first?",
            short: 'First Score',
            gamePhase: 'q1',
            options: [{ name: "Philadelphia", score: 100, image: "/images/phi.svg" }, { name: "Kansas City", score: 100, image: "/images/kc.svg" }]
        },
        {
            question: "Which DC or Marvel movie trailer will appear first during the game broadcast?",
            short: 'Commercial',
            gamePhase: 'q1',
            options: [{ name: "Superman", score: 100}, { name: "Captain America: Brave New World", score: 100}, { name: "Thunderbolts", score: 100}, { name: "The Fantastic Four: First Steps", score: 100}]
        },
        {
            question: "Will Saquon Barkley reach 30 yards rushing by the end of the first quarter?",
            short: 'Saquon',
            gamePhase: 'q1',
            options: [{ name: "Yes", score: 100 }, { name: "No", score: 100 }],
            extrainfo: "Barkley needs 30 rushing yards to break the record for total rushing yards in a regular season+postseason. His rushing yards prop for the Super Bowl is 111.5 (BetMGM)"
        },
        {
            question: "Who will be the first to make a guest appearance with Kendrick Lamar during the halftime show?",
            short: 'HT Guest Artist',
            gamePhase: 'halftime',
            extrainfo: "If multiple artists appear, points will be given the first artist that appears (besides other)",
            options: [
                { name: "Future", score: 100 },
                { name: "Metro Boomin'", score: 100 },
                { name: "Lil' Wayne", score: 100 },
                { name: "Baby Keem", score: 100 },
                { name: "None/Other", score: 100 }
            ]
        },
        {
            question: "Will SZA wear a jersey of any kind during the halftime performance?",
            short: 'HT Jersey',
            gamePhase: 'halftime',
            options: [{ name: "Yes", score: 100 }, { name: "No", score: 75 }]
        },
        {
            question: "Will there be a fourth quarter comeback?",
            short: 'Comeback',
            gamePhase: 'post-game',
            options: [{ name: "Yes", score: 140 }, { name: "No", score: 60 }]
        },
        {
            question: "Will the team who scores first win the game?",
            short: 'First Score Wins',
            gamePhase: 'post-game',
            options: [{ name: "Yes", score: 85 }, { name: "No", score: 115 }]
        },
        {
            question: "Who will win Super Bowl LIX MVP?",
            short: 'MVP',
            gamePhase: 'post-game',
            options: [
                { name: "Patrick Mahomes (KC QB)", image: "/images/mahomes2.webp", score: 90},
                {name: "Saquon Barkley (PHI RB)", image: "/images/barkley.webp", score: 110 },
                { name: "Jalen Hurts (PHI QB)", image: "/images/hurts.webp", score: 125 },
                { name: "Other", score: 200 }
            ]
        }
    ],
    "2026": [
        {
            question: "How long will it take to sing the National Anthem?",
            short: "National Anthem",
            gamePhase: 'pre-game',
            extrainfo: `The average Super Bowl anthem time is 1:43. Shortest: Neil Diamond at 1:02. Longest: Alicia Keys at 2:36.`,
            config: {
                placeholder: "M:SS"
            }
        },
        {
            question: "What will the opening coin toss land on?",
            short: 'Coin Toss',
            gamePhase: 'pre-game',
            extrainfo: 'Since 1967: HEADS 29 times, TAILS 30 times. Very close to 50/50!',
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
            extrainfo: 'Only happens in about 15% of Super Bowls historically',
            options: [{ name: "Yes", score: 150 }, { name: "No", score: 75 }]
        },
        {
            question: "Which will happen first in the game?",
            short: 'Sack or Interception',
            gamePhase: 'q1',
            options: [{ name: "Sack", score: 75 }, { name: "Interception", score: 125 }, { name: "Neither in Q1", score: 100 }]
        },
        {
            question: "Who will be the halftime performer's first guest artist?",
            short: 'HT Guest Artist',
            gamePhase: 'halftime',
            extrainfo: "Recent Super Bowls have featured surprise guests",
            options: [
                { name: "No Guest Artists", score: 125 },
                { name: "Previous Super Bowl Performer", score: 100 },
                { name: "Current Chart-Topper", score: 100 },
                { name: "Rock/Metal Artist", score: 150 },
                { name: "Country Artist", score: 175 },
                { name: "Completely Unexpected", score: 200 }
            ]
        },
        {
            question: "What color will dominate the halftime stage lighting?",
            short: 'HT Lighting',
            gamePhase: 'halftime',
            options: [
                { name: "Blue", score: 100 },
                { name: "Red", score: 100 },
                { name: "Purple", score: 125 },
                { name: "Green", score: 125 },
                { name: "Gold/Yellow", score: 150 },
                { name: "Multi-color/Rainbow", score: 75 }
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
            extrainfo: 'Only 1 Super Bowl has ever gone to OT (Patriots vs Falcons, 2017)',
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
                { name: "Patriots QB", score: 100 },
                { name: "Seahawks QB", score: 100 },
                { name: "Patriots RB", score: 150 },
                { name: "Seahawks RB", score: 150 },
                { name: "Patriots WR/TE", score: 125 },
                { name: "Seahawks WR/TE", score: 125 },
                { name: "Defensive Player", score: 200 },
                { name: "Kicker/Special Teams", score: 500 }
            ]
        }
    ],
};