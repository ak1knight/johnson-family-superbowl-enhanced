import React, { useState, useEffect } from 'react';
import { teams, periodNames, Entry, TeamScore, TeamName } from "../../data/formdata";

function formatScore(entry: Entry, quarter: string, year: string) {
    if (!entry[teams[year][0].name] || !entry[teams[year][1].name])
        return
    const firstTeamScore = parseInt((entry[teams[year][0].name]?.[quarter as typeof periodNames[number]]?.score || '0').toString());
    const secondTeamScore = parseInt((entry[teams[year][1].name]?.[quarter as typeof periodNames[number]]?.score || '0').toString());
    return firstTeamScore == secondTeamScore ? `${firstTeamScore} - ${secondTeamScore} Tie`
        : firstTeamScore > secondTeamScore ? `${firstTeamScore} - ${secondTeamScore} ${teams[year][0].name}`
            : `${secondTeamScore} - ${firstTeamScore} ${teams[year][1].name}`
}

const finalColors = [
    'bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 shadow-lg', // 1st place - Gold
    'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800 shadow-md',       // 2nd place - Silver  
    'bg-gradient-to-r from-orange-400 to-orange-500 text-orange-900 shadow-md'  // 3rd place - Bronze
];

function toSeconds(str: string) {
    if (str.includes(":")) {
        const pieces = str.split(":");
        const result = Number(pieces[0]) * 60 + Number(pieces[1]);
        return (result);
    } else {
        return Number(str);
    }
}

type WinningNumbers = {
    "Quarter 1"?: number,
    "Quarter 2"?: number,
    "Quarter 3"?: number,
    "Final"?: number,
    topthree?: [first: number, second: number, third: number],
    anthemLength?: number,
    [key: string]: number | [number, number, number] | undefined;
}

interface BigBoardTableProps {
    year: string | number;
    onEntriesLoad?: (count: number) => void;
}

const BigBoardTable = ({ year, onEntriesLoad }: BigBoardTableProps) => {
    const [entries, setEntries] = useState<Array<{entry: Entry, yearKey: string | number, id: number}>>();
    const [winningEntry, setWinningEntry] = useState<{entry: Entry, yearKey: string | number}>();
    const [winningNumbers, setWinningNumbers] = useState<WinningNumbers>({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<'name' | 'final'>('name');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    useEffect(() => {
        setEntries(undefined);
        setWinningEntry(undefined);
        setIsLoading(true);
        setError(null);

        async function fetchData() {
            try {
                const [entryResponse, winningEntryResponse] = await Promise.all([
                    fetch(`/api/entry/${year}`),
                    fetch(`/api/winningentry/${year}`)
                ]);
                
                if (!entryResponse.ok) {
                    throw new Error(`Failed to fetch entries: ${entryResponse.status}`);
                }
                if (!winningEntryResponse.ok) {
                    throw new Error(`Failed to fetch winning entry: ${winningEntryResponse.status}`);
                }

                const [entriesData, winningEntryData] = await Promise.all([
                    entryResponse.json(),
                    winningEntryResponse.json()
                ]);

                console.log("Fetched entries and winning entry:", entriesData, winningEntryData);

                setEntries(entriesData);
                setWinningEntry(winningEntryData);
                
                // Notify parent component about entries count
                if (onEntriesLoad && entriesData) {
                    onEntriesLoad(entriesData.length);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setIsLoading(false);
            }
        }

        fetchData();
    }, [year, onEntriesLoad]);

    useEffect(() => {
        const wn: WinningNumbers = {};
        setWinningNumbers({});

        console.log("Calculating winning numbers...", winningEntry, entries, year);

        if (!winningEntry || Object.keys(winningEntry.entry).length === 0 || !winningEntry.entry[teams[year][0].name] || !entries) {
            return
        }

        periodNames.forEach(period => {
            if (!!winningEntry?.entry?.[teams[year][0].name]?.[period as keyof TeamScore] && !!winningEntry.entry[teams[year][1].name]?.[period as keyof TeamScore]) {
                wn[period] = Math.min(...entries.map((e) => (!!e.entry[teams[year][0].name]?.[period] && !!e.entry[teams[year][1].name]?.[period] && Math.abs(e.entry[teams[year][0].name]![period].score - winningEntry.entry[teams[year][0].name]![period].score) + Math.abs(e.entry[teams[year][1].name]![period].score - winningEntry.entry[teams[year][1].name]![period].score)) || Infinity));
            }
        });

        if (!!winningEntry.entry[teams[year][0].name] && !!winningEntry.entry[teams[year][0].name]!["Final"] && !!winningEntry.entry[teams[year][0].name]!["Final"].score) {
            const differences = entries.map((e) => (!!e.entry[teams[year][0].name]?.["Final"] && !!e.entry[teams[year][1].name]?.["Final"] && Math.abs(e.entry[teams[year][0].name]!["Final"].score - winningEntry.entry[teams[year][0].name]!["Final"].score) + Math.abs(e.entry[teams[year][1].name]!["Final"].score - winningEntry.entry[teams[year][1].name]!["Final"].score)) || Infinity);
            const first = Math.min(...differences);
            const second = Math.min(...differences.filter(d => d > first));
            const third = Math.min(...differences.filter(d => d > second));
            wn.topthree = [first, second, third];
        }

        teams[year].forEach(team => {
            if (!!winningEntry.entry[team.name] && winningEntry.entry[team.name]!.yards) {
                wn[team.name] = Math.min(...entries.map(e => (!!e.entry[team.name]?.yards && Math.abs(e.entry[team.name]!.yards - winningEntry.entry[team.name]!.yards)) || Infinity));
            }
        })

        if (!!winningEntry.entry[0] && winningEntry.entry[0].response) {
            wn.anthemLength = Math.min(...entries.map(e => Math.abs(toSeconds(e.entry[0].response as string) - toSeconds(winningEntry.entry[0].response as string))));
        }

        setWinningNumbers(wn);
    }, [winningEntry, entries, year]);

    function checkWinningScore(entry: Entry, period: "Quarter 1" | "Quarter 2" | "Quarter 3" | "Final") {
        const winningEntriesExist = !!winningNumbers && !!winningEntry && !!winningEntry.entry[teams[year][0].name] && !!winningEntry.entry[teams[year][1].name] && !!winningEntry.entry[teams[year][0].name]![period];
        const entryIncludesBothTeams = !!entry[teams[year][0].name] && !!entry[teams[year][1].name] && !!entry[teams[year][0].name]![period] && !!entry[teams[year][1].name]![period];
        return winningEntriesExist && entryIncludesBothTeams && Math.abs(entry[teams[year][0].name]![period].score - winningEntry.entry[teams[year][0].name]![period].score) + Math.abs(entry[teams[year][1].name]![period].score - winningEntry.entry[teams[year][1].name]![period].score) == winningNumbers[period];
    }

    function checkFinalScore(entry: Entry) {
        const hasValidWinningEntry = !!winningNumbers?.topthree && !!winningEntry && !!winningEntry.entry[teams[year][0].name] && !!winningEntry.entry[teams[year][1].name] && !!winningEntry.entry[teams[year][0].name]!["Final"];
        const entryIncludesBothTeams = !!entry[teams[year][0].name] && !!entry[teams[year][1].name] && !!entry[teams[year][0].name]!["Final"] && !!entry[teams[year][1].name]!["Final"];
        return hasValidWinningEntry && entryIncludesBothTeams && winningNumbers.topthree!.indexOf(Math.abs(entry[teams[year][0].name]!["Final"].score - winningEntry.entry[teams[year][0].name]!["Final"].score) + Math.abs(entry[teams[year][1].name]!["Final"].score - winningEntry.entry[teams[year][1].name]!["Final"].score));
    }

    function checkTiebreaker(entry: Entry, period: "Quarter 1" | "Quarter 2" | "Quarter 3" | "Final") {
        const hasValidTiebreaker = !!winningNumbers && !!winningEntry && !!entries && !!winningEntry.entry[period]?.tiebreaker;
        const entryIncludesTiebreaker = !!entry[period]?.tiebreaker;
        return hasValidTiebreaker && entryIncludesTiebreaker && Math.abs(entry[period].tiebreaker - winningEntry.entry[period].tiebreaker) == Math.min(...entries.filter(e => checkWinningScore(e.entry, period)).map(e => Math.abs(e.entry[period].tiebreaker - winningEntry.entry[period].tiebreaker)));
    }

    function checkWinningYards(entry: Entry, team: TeamName) {
        const winningEntriesExist = !!winningNumbers && !!winningEntry && !!winningEntry.entry[team];
        const entryIncludesBothTeams = !!entry[teams[year][0].name] && !!entry[teams[year][1].name] && !!entry[teams[year][0].name]!.yards && !!entry[teams[year][1].name]!.yards;
        return winningEntriesExist && entryIncludesBothTeams && Math.abs(entry[team]!.yards - winningEntry.entry[team]!.yards) == winningNumbers[team];
    }

    function checkWinningAnthemTime(entry: Entry) {
        return !!winningNumbers && !!winningEntry && !!winningEntry.entry[0] && !!winningEntry.entry[0].response && Math.abs(toSeconds(entry[0].response as string) - toSeconds(winningEntry.entry[0].response as string)) == winningNumbers.anthemLength;
    }

    const sortedEntries = entries ? [...entries].sort((a, b) => {
        if (!a.entry || !b.entry || !a.entry.name || !b.entry.name) return 0;
        if (sortBy === 'name') {
            const comparison = a.entry.name.localeCompare(b.entry.name);
            return sortOrder === 'asc' ? comparison : -comparison;
        } else if (sortBy === 'final') {
            const aPlace = checkFinalScore(a.entry);
            const bPlace = checkFinalScore(b.entry);
            if (aPlace !== false && aPlace !== -1 && bPlace !== false && bPlace !== -1) {
                return sortOrder === 'asc' ? aPlace - bPlace : bPlace - aPlace;
            }
            if (aPlace !== false && aPlace !== -1) return -1;
            if (bPlace !== false && bPlace !== -1) return 1;
            return -1;
        }
        return 0;
    }) : [];

    const handleSort = (column: 'name' | 'final') => {
        if (sortBy === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortOrder('asc');
        }
    };

    if (error) {
        return (
            <div className="card bg-error/10 border border-error/20 text-error">
                <div className="card-body">
                    <div className="flex items-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                            <h3 className="font-semibold">Error Loading Data</h3>
                            <p className="text-sm opacity-80">{error}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-2xl bg-base-100 shadow-xl border border-base-300/50">
            {/* Table Header */}
            <div className="bg-primary/10 px-6 py-4 border-b border-base-300/50">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h3 className="text-xl font-semibold text-base-content">
                        Leaderboard - Super Bowl {year}
                    </h3>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-base-content/70">Sort by:</span>
                        <div className="join">
                            <button
                                onClick={() => handleSort('name')}
                                className={`btn btn-sm join-item ${sortBy === 'name' ? 'btn-primary' : 'btn-outline'}`}
                            >
                                Name
                                {sortBy === 'name' && (
                                    <span className="ml-1">
                                        {sortOrder === 'asc' ? '↑' : '↓'}
                                    </span>
                                )}
                            </button>
                            <button
                                onClick={() => handleSort('final')}
                                className={`btn btn-sm join-item ${sortBy === 'final' ? 'btn-primary' : 'btn-outline'}`}
                            >
                                Final Rank
                                {sortBy === 'final' && (
                                    <span className="ml-1">
                                        {sortOrder === 'asc' ? '↑' : '↓'}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table Container */}
            <div className="overflow-x-auto">
                <table className="table table-sm w-full">
                    <thead className="bg-base-200/50">
                        <tr>
                            <th className="text-left font-semibold text-base-content/80">Name</th>
                            <th className="text-center font-semibold text-base-content/80">
                                <div className="flex items-center justify-center gap-1">
                                    🎵 Anthem
                                </div>
                            </th>
                            {periodNames.map((q, i) => (
                                <th key={i} className="text-center font-semibold text-base-content/80 min-w-[120px]">
                                    <div className="flex items-center justify-center gap-1">
                                        🏈 {q}
                                    </div>
                                </th>
                            ))}
                            {teams[year] && teams[year].map((t, i) => (
                                <th key={i} className="text-center font-semibold text-base-content/80 min-w-[100px]">
                                    <div className="flex items-center justify-center gap-1">
                                        📏 {t.name}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={6} className="text-center py-16">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="flex space-x-1">
                                            <div className="w-3 h-3 bg-primary rounded-full animate-bounce"></div>
                                            <div className="w-3 h-3 bg-secondary rounded-full animate-bounce delay-100"></div>
                                            <div className="w-3 h-3 bg-accent rounded-full animate-bounce delay-200"></div>
                                        </div>
                                        <div className="text-lg font-medium text-base-content/70">Loading board data...</div>
                                        <div className="text-sm text-base-content/50">Fetching results for {year}</div>
                                    </div>
                                </td>
                            </tr>
                        ) : entries && entries.length > 0 ? (
                            sortedEntries.map((e) => {
                                const finalPlace = checkFinalScore(e.entry);
                                const isWinner = finalPlace !== false && finalPlace > -1;

                                return (
                                    <tr key={e.id} className={`hover:bg-base-200/50 transition-colors duration-200 ${isWinner ? 'bg-primary/5' : ''}`}>
                                        <td className="font-medium">
                                            <div className="flex items-center gap-2">
                                                <span>{e.entry.name}</span>
                                                {isWinner && (
                                                    <div className={`badge badge-sm ${finalColors[finalPlace]} font-bold`}>
                                                        #{finalPlace + 1}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        
                                        <td className={`text-center ${checkWinningAnthemTime(e.entry) ? 'bg-success/20 border border-success/30 font-bold text-success' : ''}`}>
                                            <div className="flex items-center justify-center gap-1">
                                                {checkWinningAnthemTime(e.entry) && <span className="text-lg">🎯</span>}
                                                {e.entry[0].response as string}
                                            </div>
                                        </td>
                                        
                                        {periodNames.slice(0, 3).map((q, i) => {
                                            const isWinning = checkWinningScore(e.entry, q);
                                            const isTiebreaker = checkTiebreaker(e.entry, q);
                                            
                                            return (
                                                <td key={i} className={`text-center ${isWinning ? (isTiebreaker ? 'bg-success text-success-content font-bold border border-success' : 'bg-warning/30 text-warning-content font-semibold border border-warning') : ''}`}>
                                                    <div className="flex items-center justify-center gap-1">
                                                        {isWinning && <span className="text-lg">{isTiebreaker ? '🏆' : '⭐'}</span>}
                                                        <span className="text-sm">{formatScore(e.entry, q, year.toString())}</span>
                                                    </div>
                                                </td>
                                            );
                                        })}
                                        
                                        <td className={`text-center ${isWinner ? finalColors[finalPlace] : ''}`}>
                                            <div className="flex items-center justify-center gap-2">
                                                {isWinner && (
                                                    <span className="text-xl">
                                                        {finalPlace === 0 ? '🥇' : finalPlace === 1 ? '🥈' : '🥉'}
                                                    </span>
                                                )}
                                                <span className={`text-sm ${isWinner ? 'font-bold' : ''}`}>
                                                    {formatScore(e.entry, 'Final', year.toString())}
                                                </span>
                                            </div>
                                        </td>
                                        
                                        {teams[year].map((t, i) => (
                                            <td key={i} className={`text-center ${checkWinningYards(e.entry, t.name) ? 'bg-info/20 border border-info/30 font-bold text-info' : ''}`}>
                                                <div className="flex items-center justify-center gap-1">
                                                    {checkWinningYards(e.entry, t.name) && <span className="text-lg">🎯</span>}
                                                    {e.entry[t.name]?.yards}
                                                </div>
                                            </td>
                                        ))}
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={6} className="text-center py-16">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="text-6xl opacity-20">📊</div>
                                        <div className="text-lg font-medium text-base-content/70">
                                            No entries found for {year}
                                        </div>
                                        <div className="text-sm text-base-content/50">
                                            Entries will appear here once they're submitted
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            
            {/* Table Footer */}
            {entries && entries.length > 0 && (
                <div className="bg-base-200/30 px-6 py-3 border-t border-base-300/50">
                    <div className="flex items-center justify-between text-sm text-base-content/70">
                        <span>Total entries: {entries.length}</span>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                                <span className="w-3 h-3 bg-success rounded"></span>
                                <span>Perfect Match</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="w-3 h-3 bg-warning rounded"></span>
                                <span>Closest</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="w-3 h-3 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded"></span>
                                <span>Winner</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BigBoardTable;