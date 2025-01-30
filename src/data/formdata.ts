export enum TeamName {
    Chiefs = "Chiefs",
    Buccaneers = "Buccaneers",
    "49ers" = "49ers",
    Rams = "Rams",
    Bengals = "Bengals",
    Eagles = "Eagles"
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
    options?: Option[]
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
} as const; 

export const periodNames = ["Quarter 1", "Quarter 2", "Quarter 3", "Final"] as const;

export type TeamScore = {
    "Quarter 1": {
        score: number;
    };
    "Quarter 2": {
        score: number;
    };
    "Quarter 3": {
        score: number;
    };
    "Final": {
        score: number;
    };
    yards: number;
};

export type Entry = {
    [index: number]: AnsweredQuestion,
    [TeamName.Chiefs]?: TeamScore,
    "49ers"?: TeamScore,
    [TeamName.Buccaneers]?: TeamScore,
    [TeamName.Bengals]?: TeamScore,
    [TeamName.Rams]?: TeamScore,
    [TeamName.Eagles]?: TeamScore,
    "Quarter 1": {
        tiebreaker: number
    },
    "Quarter 2": {
        tiebreaker: number
    },
    "Quarter 3": {
        tiebreaker: number
    },
    "Final": {
        tiebreaker: number
    },
    name: string
}

export const tiebreakers: Record<string, Record<string, string>> = {
    "2021": {"Quarter 1": "Chiefs Passing Yards", "Quarter 2": "Buccaneers Rushing Yards", "Quarter 3": "Combined Penalty Yards"},
    "2022": {"Quarter 1": "Bengals Passing Yards", "Quarter 2": "Rams Rushing Yards", "Quarter 3": "Combined Penalty Yards"},
    "2023": {"Quarter 1": "Eagles Passing Yards", "Quarter 2": "Chiefs Rushing Yards", "Quarter 3": "Combined Penalty Yards"},
    "2024": {"Quarter 1": "Chiefs Passing Yards", "Quarter 2": "49ers Rushing Yards", "Quarter 3": "Combined Penalty Yards"},
    "2025": {"Quarter 1": "Chiefs Passing Yards", "Quarter 2": "Eagles Rushing Yards", "Quarter 3": "Combined Penalty Yards"}
}

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
};