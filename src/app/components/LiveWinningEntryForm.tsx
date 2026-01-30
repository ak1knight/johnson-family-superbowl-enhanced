import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import Card from "./card";
import { Question, periodNames, teams, TeamName } from "../../data/formdata";

type GamePhase = 'pre-game' | 'q1' | 'q2' | 'halftime' | 'q3' | 'q4' | 'post-game';

type QuarterScore = {
    [K in TeamName]?: number;
} & {
    tiebreaker?: number;
};

type TeamYards = {
    yards?: number;
};

type LiveWinningEntry = {
    // Actual results as they happen
    anthemTime?: string;
    coinToss?: string;
    firstScore?: string;
    
    // Quarter scores (only populated as quarters complete)
    quarter1?: QuarterScore;
    quarter2?: QuarterScore;
    quarter3?: QuarterScore;
    final?: QuarterScore;
    
    // Questions answered as they're determined
    questionAnswers?: { [index: number]: string };
} & {
    // Yards for any team (using index signature for flexibility)
    [K in TeamName]?: TeamYards;
};

type LiveWinningEntryFormProps = {
    year: number;
    questions: Question[];
};

const LiveWinningEntryForm: React.FC<LiveWinningEntryFormProps> = ({ year, questions }) => {
    const router = useRouter();
    const [winningEntry, setWinningEntry] = useState<LiveWinningEntry>({});
    const [gamePhase, setGamePhase] = useState<GamePhase>('pre-game');
    const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [saving, setSaving] = useState(false);
    const [existingEntries, setExistingEntries] = useState<any[]>([]);
    const [selectedBaseEntry, setSelectedBaseEntry] = useState<string>('');
    const [showEntrySelector, setShowEntrySelector] = useState(false);

    // Load existing entries for selection
    useEffect(() => {
        async function fetchEntries() {
            try {
                const response = await fetch(`/api/entry/${year}`);
                if (response.ok) {
                    const entries = await response.json();
                    setExistingEntries(entries);
                }
            } catch (error) {
                console.error('Failed to fetch existing entries:', error);
            }
        }
        fetchEntries();
    }, [year]);

    // Load existing winning entry if it exists
    useEffect(() => {
        async function fetchWinningEntry() {
            try {
                const response = await fetch(`/api/winningentry/${year}`);
                if (response.ok) {
                    const existing = await response.json();
                    if (existing && Object.keys(existing).length > 0) {
                        setWinningEntry(existing);
                    }
                }
            //eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
                console.log('No existing winning entry found');
            }
        }
        fetchWinningEntry();
    }, [year]);

    // Auto-save functionality
    useEffect(() => {
        if (!autoSaveEnabled) return;
        
        const saveTimer = setTimeout(() => {
            saveWinningEntry(false); // Silent save
        }, 5000); // Auto-save every 5 seconds

        return () => clearTimeout(saveTimer);
    }, [winningEntry, autoSaveEnabled]);

    const saveWinningEntry = async (showNotification = true) => {
        setSaving(true);
        try {
            // Convert our format to the format expected by the big board
            const convertedEntry = convertToExpectedFormat(winningEntry);
            
            // Use partial update API to preserve existing data
            const response = await fetch(`/api/winningentry/update/${year}`, {
                method: "PATCH",
                body: JSON.stringify({ partialEntry: convertedEntry }),
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Failed to save');
            }

            setLastSaved(new Date());
            if (showNotification) {
                // Could add toast notification here
            }
        } catch (error) {
            console.error('Save failed:', error);
            if (showNotification) {
                // Could add error notification here
            }
        } finally {
            setSaving(false);
        }
    };

    const convertToExpectedFormat = (liveEntry: LiveWinningEntry) => {
        const converted: any = {
            name: "Winning Entry"
        };

        // Convert team scores and tiebreakers to expected format
        teams[year].forEach((team, _index) => {
            converted[team.name] = {
                yards: liveEntry[team.name]?.yards || 0
            };

            // Add quarter scores to team structure
            periodNames.forEach(period => {
                const quarterKey = period === 'Quarter 1' ? 'quarter1'
                    : period === 'Quarter 2' ? 'quarter2'
                    : period === 'Quarter 3' ? 'quarter3'
                    : 'final';
                
                const quarterData = liveEntry[quarterKey];
                if (quarterData && quarterData[team.name] !== undefined) {
                    converted[team.name][period] = {
                        score: quarterData[team.name]
                    };
                }
            });
        });

        // Convert tiebreakers to expected format
        periodNames.forEach((period, _index) => {
            const quarterKey = period === 'Quarter 1' ? 'quarter1'
                : period === 'Quarter 2' ? 'quarter2'
                : period === 'Quarter 3' ? 'quarter3'
                : 'final';
            
            const quarterData = liveEntry[quarterKey];
            if (quarterData && quarterData.tiebreaker !== undefined) {
                converted[period] = {
                    tiebreaker: quarterData.tiebreaker
                };
            }
        });

        // Convert anthem time to expected format (indexed question format)
        if (liveEntry.anthemTime) {
            converted[0] = {
                question: "How long will it take to sing the National Anthem?",
                response: liveEntry.anthemTime
            };
        }

        // Convert other question answers to indexed format
        if (liveEntry.questionAnswers) {
            Object.entries(liveEntry.questionAnswers).forEach(([index, answer]) => {
                const questionIndex = parseInt(index);
                converted[questionIndex] = {
                    question: questions[questionIndex]?.question || `Question ${questionIndex}`,
                    response: answer
                };
            });
        }

        return converted;
    };

    const loadFromExistingEntry = (entryId: string) => {
        const selectedEntry = existingEntries.find(e => e.id.toString() === entryId);
        if (selectedEntry && selectedEntry.entry) {
            // Convert the existing entry to our live format but keep future predictions blank
            const existingData = selectedEntry.entry;
            const baseEntry: LiveWinningEntry = {
                anthemTime: existingData[0]?.response as string || '', // Copy their anthem prediction as starting point
                questionAnswers: {}
            };

            // Copy question answers from the existing entry
            questions.forEach((_q, index) => {
                if (existingData[index]?.response) {
                    baseEntry.questionAnswers = baseEntry.questionAnswers || {};
                    baseEntry.questionAnswers[index] = existingData[index].response as string;
                }
            });

            // Copy team scores as starting points (these will be overwritten with actual results)
            teams[year].forEach(team => {
                if (existingData[team.name]) {
                    baseEntry[team.name] = {
                        yards: existingData[team.name].yards || 0
                    };
                }
            });

            // Copy predicted scores to give a starting point
            periodNames.forEach((period) => {
                const quarterKey = period === 'Quarter 1' ? 'quarter1'
                    : period === 'Quarter 2' ? 'quarter2'
                    : period === 'Quarter 3' ? 'quarter3'
                    : 'final';
                
                if (existingData[teams[year][0].name]?.[period] || existingData[teams[year][1].name]?.[period]) {
                    baseEntry[quarterKey] = {
                        [teams[year][0].name]: existingData[teams[year][0].name]?.[period]?.score || 0,
                        [teams[year][1].name]: existingData[teams[year][1].name]?.[period]?.score || 0,
                        tiebreaker: existingData[period]?.tiebreaker || 0
                    };
                }
            });

            setWinningEntry(baseEntry);
            setSelectedBaseEntry(entryId);
            setShowEntrySelector(false);
        }
    };

    const updateScore = (quarter: keyof LiveWinningEntry, team: TeamName, score: number) => {
        setWinningEntry(prev => ({
            ...prev,
            [quarter]: {
                ...prev[quarter] as any,
                [team]: score
            }
        }));
    };

    const updateTiebreaker = (quarter: keyof LiveWinningEntry, value: number) => {
        setWinningEntry(prev => ({
            ...prev,
            [quarter]: {
                ...prev[quarter] as any,
                tiebreaker: value
            }
        }));
    };

    const updateYards = (team: TeamName, yards: number) => {
        setWinningEntry(prev => ({
            ...prev,
            [team]: { yards }
        }));
    };

    const updateQuestionAnswer = (index: number, answer: string) => {
        setWinningEntry(prev => ({
            ...prev,
            questionAnswers: {
                ...prev.questionAnswers,
                [index]: answer
            }
        }));
    };

    const getAvailableSections = () => {
        const sections = [];
        
        // Pre-game always available
        sections.push('pre-game');
        
        // Quarter sections based on game phase
        if (['q1', 'q2', 'halftime', 'q3', 'q4', 'post-game'].includes(gamePhase)) {
            sections.push('quarter1');
            sections.push('q1-questions');
        }
        if (['q2', 'halftime', 'q3', 'q4', 'post-game'].includes(gamePhase)) {
            sections.push('quarter2');
            sections.push('q2-questions');
        }
        if (['halftime', 'q3', 'q4', 'post-game'].includes(gamePhase)) {
            sections.push('halftime-questions');
        }
        if (['q3', 'q4', 'post-game'].includes(gamePhase)) {
            sections.push('quarter3');
            sections.push('q3-questions');
        }
        if (['q4', 'post-game'].includes(gamePhase)) {
            sections.push('quarter4');
            sections.push('q4-questions');
        }
        if (gamePhase === 'post-game') {
            sections.push('final-stats');
            sections.push('post-game-questions');
        }
        
        return sections;
    };

    const renderGamePhaseSelector = () => (
        <Card title="Game Phase">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                {(['pre-game', 'q1', 'q2', 'halftime', 'q3', 'q4', 'post-game'] as GamePhase[]).map(phase => (
                    <button
                        key={phase}
                        type="button"
                        className={`btn h-12 text-xs sm:text-sm ${gamePhase === phase ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => setGamePhase(phase)}
                    >
                        {phase.replace('-', ' ').toUpperCase()}
                    </button>
                ))}
            </div>
        </Card>
    );

    const renderPreGameSection = () => {
        const preGameQuestions = questions.filter(q => q.gamePhase === 'pre-game');
        
        return (
            <Card title="Pre-Game Events">
                <div className="space-y-4">
                    <div>
                        <label className="label">
                            <span className="label-text font-medium">National Anthem Time (M:SS)</span>
                        </label>
                        <input
                            type="text"
                            className="input input-bordered w-full h-12 text-lg"
                            placeholder="1:45"
                            value={winningEntry.anthemTime || ''}
                            onChange={(e) => setWinningEntry(prev => ({ ...prev, anthemTime: e.target.value }))}
                        />
                    </div>
                    
                    {/* Render pre-game questions */}
                    {preGameQuestions.map((q) => {
                        const actualIndex = questions.indexOf(q);
                        return (
                            <div key={actualIndex}>
                                <label className="label">
                                    <span className="label-text font-medium">{q.question}</span>
                                </label>
                                {q.extrainfo && (
                                    <div className="text-sm text-gray-600 mb-2">{q.extrainfo}</div>
                                )}
                                {q.options ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {q.options.map(option => (
                                            <button
                                                key={option.name}
                                                type="button"
                                                className={`btn h-auto p-3 ${
                                                    winningEntry.questionAnswers?.[actualIndex] === option.name
                                                        ? 'btn-primary'
                                                        : 'btn-outline'
                                                } text-left`}
                                                onClick={() => updateQuestionAnswer(actualIndex, option.name)}
                                            >
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{option.name}</span>
                                                    <span className="text-sm opacity-70">{option.score} pts</span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <input
                                        type="text"
                                        className="input input-bordered w-full h-12 text-lg"
                                        placeholder={q.config?.placeholder || "Enter answer..."}
                                        value={winningEntry.questionAnswers?.[actualIndex] || ''}
                                        onChange={(e) => updateQuestionAnswer(actualIndex, e.target.value)}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
            </Card>
        );
    };

    const renderQuestionsByPhase = (phase: 'q1' | 'q2' | 'q3' | 'q4' | 'halftime' | 'post-game') => {
        const phaseQuestions = questions.filter(q => q.gamePhase === phase);
        if (phaseQuestions.length === 0) return null;

        const phaseNames = {
            'q1': 'First Quarter',
            'q2': 'Second Quarter',
            'q3': 'Third Quarter',
            'q4': 'Fourth Quarter',
            'halftime': 'Halftime',
            'post-game': 'Post-Game'
        };

        return (
            <Card title={`${phaseNames[phase]} Questions`}>
                <div className="space-y-4">
                    {phaseQuestions.map((q) => {
                        const actualIndex = questions.indexOf(q);
                        return (
                            <div key={actualIndex}>
                                <label className="label">
                                    <span className="label-text font-medium">{q.question}</span>
                                </label>
                                {q.extrainfo && (
                                    <div className="text-sm text-gray-600 mb-2">{q.extrainfo}</div>
                                )}
                                {q.options ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {q.options.map(option => (
                                            <button
                                                key={option.name}
                                                type="button"
                                                className={`btn h-auto p-3 ${
                                                    winningEntry.questionAnswers?.[actualIndex] === option.name
                                                        ? 'btn-primary'
                                                        : 'btn-outline'
                                                } text-left`}
                                                onClick={() => updateQuestionAnswer(actualIndex, option.name)}
                                            >
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{option.name}</span>
                                                    <span className="text-sm opacity-70">{option.score} pts</span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <input
                                        type="text"
                                        className="input input-bordered w-full h-12 text-lg"
                                        placeholder={q.config?.placeholder || "Enter answer..."}
                                        value={winningEntry.questionAnswers?.[actualIndex] || ''}
                                        onChange={(e) => updateQuestionAnswer(actualIndex, e.target.value)}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
            </Card>
        );
    };

    const renderQuarterSection = (quarter: 'quarter1' | 'quarter2' | 'quarter3' | 'final', displayName: string) => {
        const quarterData = winningEntry[quarter] as any;
        
        return (
            <Card title={`${displayName} Results`}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {teams[year].map((team, _index) => (
                        <div key={team.name}>
                            <label className="label">
                                <span className="label-text font-medium">{team.name} Score</span>
                            </label>
                            <input
                                type="number"
                                className="input input-bordered w-full h-12 text-lg"
                                placeholder="0"
                                value={quarterData?.[team.name] || ''}
                                onChange={(e) => updateScore(quarter, team.name, parseInt(e.target.value) || 0)}
                            />
                        </div>
                    ))}
                    <div>
                        <label className="label">
                            <span className="label-text font-medium">Tiebreaker</span>
                        </label>
                        <input
                            type="number"
                            className="input input-bordered w-full h-12 text-lg"
                            placeholder="0"
                            value={quarterData?.tiebreaker || ''}
                            onChange={(e) => updateTiebreaker(quarter, parseInt(e.target.value) || 0)}
                        />
                    </div>
                </div>
            </Card>
        );
    };

    const renderFinalSection = () => (
        <Card title="Final Results & Stats">
            <div className="space-y-6">
                {/* Final scores */}
                <div>
                    <h3 className="text-lg font-semibold mb-3">Final Scores</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                        {teams[year].map((team, _index) => (
                            <div key={team.name}>
                                <label className="label">
                                    <span className="label-text font-medium">{team.name} Final Score</span>
                                </label>
                                <input
                                    type="number"
                                    className="input input-bordered w-full h-12 text-lg"
                                    placeholder="0"
                                    value={winningEntry.final?.[team.name as keyof typeof winningEntry.final] || ''}
                                    onChange={(e) => updateScore('final', team.name, parseInt(e.target.value) || 0)}
                                />
                            </div>
                        ))}
                        <div>
                            <label className="label">
                                <span className="label-text font-medium">Final Tiebreaker</span>
                            </label>
                            <input
                                type="number"
                                className="input input-bordered w-full h-12 text-lg"
                                placeholder="0"
                                value={winningEntry.final?.tiebreaker || ''}
                                onChange={(e) => updateTiebreaker('final', parseInt(e.target.value) || 0)}
                            />
                        </div>
                    </div>
                </div>

                {/* Yards */}
                <div>
                    <h3 className="text-lg font-semibold mb-3">Total Yards</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        {teams[year].map((team, _index) => (
                            <div key={team.name}>
                                <label className="label">
                                    <span className="label-text font-medium">{team.name} Total Yards</span>
                                </label>
                                <input
                                    type="number"
                                    className="input input-bordered w-full h-12 text-lg"
                                    placeholder="0"
                                    value={winningEntry[team.name]?.yards || ''}
                                    onChange={(e) => updateYards(team.name, parseInt(e.target.value) || 0)}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Card>
    );

    const renderAutoSaveStatus = () => (
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    checked={autoSaveEnabled}
                    onChange={(e) => setAutoSaveEnabled(e.target.checked)}
                />
                <span className="text-sm">Auto-save enabled</span>
            </div>
            
            <div className="flex items-center gap-2">
                {saving ? (
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                        <span className="loading loading-spinner loading-xs"></span>
                        Saving...
                    </span>
                ) : lastSaved ? (
                    <span className="text-sm text-gray-500">
                        Last saved: {lastSaved.toLocaleTimeString()}
                    </span>
                ) : null}
                
                <button
                    type="button"
                    className="btn btn-sm btn-primary"
                    onClick={() => saveWinningEntry(true)}
                    disabled={saving}
                >
                    Save Now
                </button>
            </div>
        </div>
    );

    const renderEntrySelector = () => (
        <Card title="Quick Start Options">
            <div className="space-y-4">
                <div>
                    <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={() => setShowEntrySelector(!showEntrySelector)}
                    >
                        {showEntrySelector ? 'Hide' : 'Show'} Existing Entries
                    </button>
                </div>
                
                {showEntrySelector && (
                    <div>
                        <label className="label">
                            <span className="label-text">Start from existing entry structure</span>
                        </label>
                        <select
                            className="select select-bordered w-full"
                            value={selectedBaseEntry}
                            onChange={(e) => loadFromExistingEntry(e.target.value)}
                        >
                            <option value="">Select an entry...</option>
                            {existingEntries.map(entry => (
                                <option key={entry.id} value={entry.id}>
                                    {entry.entry?.name || `Entry ${entry.id}`}
                                </option>
                            ))}
                        </select>
                        <div className="text-sm text-gray-500 mt-2">
                            This will load the entry structure but keep all predictions blank for you to enter actual results.
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );

    return (
        <div className="max-w-6xl mx-auto p-2 sm:p-4">
            <div className="mb-4 sm:mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">Live Winning Entry - Super Bowl {year}</h1>
                <p className="text-sm sm:text-base text-gray-600">
                    Enter actual results as the game progresses. Only available sections will be shown based on the current game phase.
                </p>
            </div>
            <div className="space-y-2 mt-2">
                {renderAutoSaveStatus()}
                {renderEntrySelector()}
                {renderGamePhaseSelector()}
            </div>

            <div className="space-y-2 mt-2">
                {getAvailableSections().includes('pre-game') && renderPreGameSection()}
                {getAvailableSections().includes('quarter1') && renderQuarterSection('quarter1', 'Quarter 1')}
                {getAvailableSections().includes('q1-questions') && renderQuestionsByPhase('q1')}
                {getAvailableSections().includes('quarter2') && renderQuarterSection('quarter2', 'Quarter 2')}
                {getAvailableSections().includes('q2-questions') && renderQuestionsByPhase('q2')}
                {getAvailableSections().includes('halftime-questions') && renderQuestionsByPhase('halftime')}
                {getAvailableSections().includes('quarter3') && renderQuarterSection('quarter3', 'Quarter 3')}
                {getAvailableSections().includes('q3-questions') && renderQuestionsByPhase('q3')}
                {getAvailableSections().includes('quarter4') && renderQuarterSection('final', 'Quarter 4')}
                {getAvailableSections().includes('q4-questions') && renderQuestionsByPhase('q4')}
                {getAvailableSections().includes('final-stats') && renderFinalSection()}
                {getAvailableSections().includes('post-game-questions') && renderQuestionsByPhase('post-game')}
            </div>

            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-2 sm:gap-4">
                <button
                    type="button"
                    className="btn btn-secondary w-full sm:w-auto order-2 sm:order-1"
                    onClick={() => router.push("/big_board")}
                >
                    View Results
                </button>
                <button
                    type="button"
                    className="btn btn-primary w-full sm:w-auto order-1 sm:order-2"
                    onClick={() => saveWinningEntry(true)}
                    disabled={saving}
                >
                    {saving ? 'Saving...' : 'Save & Finish'}
                </button>
            </div>
        </div>
    );
};

export default LiveWinningEntryForm;