import React, { useState, useEffect, useMemo } from 'react';
import { Entry, questions } from "../../data/formdata";

interface EnhancedPropBetTableProps {
    year: string | number;
    onEntriesLoad?: (count: number) => void;
}

const EnhancedPropBetTable = ({ year, onEntriesLoad }: EnhancedPropBetTableProps) => {
    const [entries, setEntries] = useState<Array<{entry: Entry, yearKey: string | number, id: number}>>();
    const [winningEntry, setWinningEntry] = useState<{entry: Entry, yearKey: string | number}>();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
                
                if (!entryResponse.ok || !winningEntryResponse.ok) {
                    throw new Error('Failed to fetch data');
                }

                const [entriesData, winningEntryData] = await Promise.all([
                    entryResponse.json(), 
                    winningEntryResponse.json()
                ]);

                setEntries(entriesData);
                setWinningEntry({...winningEntryData, yearKey: parseInt(winningEntryData.id) + 2019});
                
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

    const propQuestions = useMemo(() => {
        return questions[year] ? questions[year].slice(1) : [];
    }, [year]);

    const sortedEntries = useMemo(() => {
        console.log('Calculating sorted entries...');
        console.log('Entries:', entries);
        console.log('Winning Entry:', winningEntry);
        if (!entries || !winningEntry || winningEntry.yearKey !== year) return [];

        const entriesWithScores = entries.map(entry => {
            const score = propQuestions.reduce((total, q, i) => {
                const isCorrect = winningEntry.entry[i + 1] && 
                                 entry.entry[i + 1].response === winningEntry.entry[i + 1].response;
                
                if (isCorrect && q.options) {
                    const option = q.options.find(o => o.name === winningEntry.entry[i + 1].response);
                    return total + (option?.score || 0);
                }
                return total;
            }, 0);

            return { ...entry, score };
        });

        return entriesWithScores.sort((a, b) => b.score - a.score);
    }, [entries, winningEntry, year, propQuestions]);

    const getScoreForQuestion = (entry: any, questionIndex: number) => {
        if (!winningEntry || winningEntry.yearKey !== year) return 0;
        
        const isCorrect = winningEntry.entry[questionIndex + 1] && 
                         entry.entry[questionIndex + 1].response === winningEntry.entry[questionIndex + 1].response;
        
        if (isCorrect && propQuestions[questionIndex]?.options) {
            const option = propQuestions[questionIndex].options.find(
                o => o.name === winningEntry.entry[questionIndex + 1].response
            );
            return option?.score || 0;
        }
        return 0;
    };

    const isCorrectAnswer = (entry: any, questionIndex: number) => {
        return winningEntry && 
               winningEntry.yearKey === year && 
               winningEntry.entry[questionIndex + 1] && 
               entry.entry[questionIndex + 1].response === winningEntry.entry[questionIndex + 1].response;
    };

    const getRankColors = (rank: number) => {
        if (rank === 0) return 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900';
        if (rank === 1) return 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800';
        if (rank === 2) return 'bg-gradient-to-r from-orange-400 to-orange-500 text-orange-900';
        if (rank < 5) return 'bg-primary/20 text-primary';
        return 'bg-base-200 text-base-content';
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
                            <h3 className="font-semibold">Error Loading Prop Bet Data</h3>
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
            <div className="bg-secondary/10 px-6 py-4 border-b border-base-300/50">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h3 className="text-xl font-semibold text-base-content">
                        🎯 Prop Bet Results - Super Bowl {year}
                    </h3>
                    <div className="text-sm text-base-content/70">
                        {propQuestions.length} prop bets • {sortedEntries.length} participants
                    </div>
                </div>
            </div>

            {/* Table Container */}
            <div className="overflow-x-auto">
                <table className="table table-sm w-full">
                    <thead className="bg-base-200/50">
                        <tr>
                            <th className="text-center font-semibold text-base-content/80 w-16">Rank</th>
                            <th className="text-left font-semibold text-base-content/80 min-w-[150px]">Name</th>
                            {propQuestions.map((q, i) => (
                                <th key={i} className="text-center font-semibold text-base-content/80 min-w-[120px]">
                                    <div className="flex flex-col items-center gap-1">
                                        <span className="text-xs opacity-70">🎯</span>
                                        <span className="text-xs leading-tight">{q.short}</span>
                                    </div>
                                </th>
                            ))}
                            <th className="text-center font-semibold text-base-content/80 w-20">
                                <div className="flex items-center justify-center gap-1">
                                    🏆 Total
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={propQuestions.length + 3} className="text-center py-16">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="flex space-x-1">
                                            <div className="w-3 h-3 bg-secondary rounded-full animate-bounce"></div>
                                            <div className="w-3 h-3 bg-accent rounded-full animate-bounce delay-100"></div>
                                            <div className="w-3 h-3 bg-primary rounded-full animate-bounce delay-200"></div>
                                        </div>
                                        <div className="text-lg font-medium text-base-content/70">Loading prop bet results...</div>
                                        <div className="text-sm text-base-content/50">Calculating scores for {year}</div>
                                    </div>
                                </td>
                            </tr>
                        ) : sortedEntries && sortedEntries.length > 0 ? (
                            sortedEntries.map((entry, index) => {
                                const rank = index;
                                const isTopFinisher = rank < 3;
                                
                                return (
                                    <tr key={entry.id} className={`hover:bg-base-200/50 transition-colors duration-200 ${isTopFinisher ? 'bg-primary/5' : ''}`}>
                                        {/* Rank */}
                                        <td className="text-center">
                                            <div className={`badge badge-lg font-bold ${getRankColors(rank)} shadow-md`}>
                                                {rank === 0 && '🥇'}
                                                {rank === 1 && '🥈'} 
                                                {rank === 2 && '🥉'}
                                                {rank > 2 && `#${rank + 1}`}
                                            </div>
                                        </td>
                                        
                                        {/* Name */}
                                        <td className="font-medium">
                                            <div className="flex items-center gap-2">
                                                {isTopFinisher && (
                                                    <span className="text-lg">
                                                        {rank === 0 ? '👑' : rank === 1 ? '🏅' : '🎖️'}
                                                    </span>
                                                )}
                                                <span>{entry.entry.name}</span>
                                            </div>
                                        </td>
                                        
                                        {/* Prop Bet Answers */}
                                        {propQuestions.map((q, qIndex) => {
                                            const isCorrect = isCorrectAnswer(entry, qIndex);
                                            const score = getScoreForQuestion(entry, qIndex);
                                            
                                            return (
                                                <td key={qIndex} className={`text-center text-sm ${isCorrect ? 'bg-success/20 border border-success/30 font-bold' : ''}`}>
                                                    <div className="flex flex-col items-center gap-1">
                                                        <div className="flex items-center gap-1">
                                                            {isCorrect && <span className="text-lg">✅</span>}
                                                            <span className={isCorrect ? 'text-success' : 'text-base-content/70'}>
                                                                {entry.entry[qIndex + 1].response as string}
                                                            </span>
                                                        </div>
                                                        {isCorrect && (
                                                            <div className="badge badge-success badge-xs">
                                                                +{score}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            );
                                        })}
                                        
                                        {/* Total Score */}
                                        <td className="text-center">
                                            <div className={`badge badge-lg font-bold ${entry.score > 0 ? 'badge-primary' : 'badge-ghost'}`}>
                                                {entry.score}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={propQuestions.length + 3} className="text-center py-16">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="text-6xl opacity-20">🎯</div>
                                        <div className="text-lg font-medium text-base-content/70">
                                            No prop bet results for {year}
                                        </div>
                                        <div className="text-sm text-base-content/50">
                                            Results will appear here once answers are submitted
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            
            {/* Table Footer */}
            {sortedEntries && sortedEntries.length > 0 && (
                <div className="bg-base-200/30 px-6 py-3 border-t border-base-300/50">
                    <div className="flex items-center justify-between text-sm text-base-content/70">
                        <span>Total participants: {sortedEntries.length}</span>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                                <span className="w-3 h-3 bg-success rounded"></span>
                                <span>Correct Answer</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="w-3 h-3 bg-primary rounded"></span>
                                <span>Points Earned</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="w-3 h-3 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded"></span>
                                <span>Top Performer</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EnhancedPropBetTable;