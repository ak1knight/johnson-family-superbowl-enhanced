import React, { useContext, useMemo, useCallback } from "react"
import { periodNames, getTiebreakerForQuarter, PeriodName } from "../../data/formdata"
import { FormContext, QUARTERS, TEAM_INDEX } from "@/data/form-context"
import { observer } from "mobx-react"
import { usePerformanceMonitor, memoizeWithLRU } from "../../utils/performance"


// Memoized helper function to parse score input with validation
const parseScore = memoizeWithLRU((value: string): number | undefined => {
    // Handle empty string explicitly
    if (value === '') {
        return undefined;
    }
    const parsed = parseInt(value, 10);
    // Explicitly check for 0 to ensure it's preserved
    if (parsed === 0) {
        return 0;
    }
    return isNaN(parsed) ? undefined : Math.max(0, Math.min(999, parsed));
}, 100);

const Scores = observer(React.forwardRef<HTMLDivElement>(function Scores() {
    const formStore = useContext(FormContext);
    
    // Performance monitoring
    usePerformanceMonitor('Scores', process.env.NODE_ENV === 'development');

    // Memoize team data to avoid recalculation
    const { homeTeam, awayTeam } = useMemo(() => ({
        homeTeam: formStore.homeTeam,
        awayTeam: formStore.awayTeam
    }), [formStore.homeTeam, formStore.awayTeam]);

    // Immediate update handlers for instant UI feedback
    const handleScoreChange = useCallback((teamIndex: 0 | 1, quarterIndex: number, value: string) => {
        const score = parseScore(value);
        // Update immediately for instant visual feedback
        formStore.setTeamScore(teamIndex, quarterIndex, score);
    }, [formStore]);

    const handleTiebreakerChange = useCallback((quarterIndex: number, value: string) => {
        const tiebreakerValue = parseScore(value);
        // Update immediately for instant visual feedback
        formStore.setTiebreaker(quarterIndex, tiebreakerValue);
    }, [formStore]);

    // Memoized tiebreaker text to avoid repeated API calls
    const tiebreakerTexts = useMemo(() => {
        return periodNames.reduce((acc, q, index) => {
            if (index !== QUARTERS.FINAL) {
                try {
                    acc[index] = getTiebreakerForQuarter(formStore.year, q as PeriodName);
                } catch (error) {
                    console.warn(`Failed to get tiebreaker for ${q}:`, error);
                    acc[index] = 'Tiebreaker info unavailable';
                }
            }
            return acc;
        }, {} as Record<number, string>);
    }, [formStore.year]);
    
    return <>
        {/* Desktop layout - horizontal */}
        <div className="hidden md:block">
            <div className="flex gap-4">
                <div className="w-1/4">
                </div>
                {periodNames.map((q, j)  => (
                    <div key={j} className="w-1/4">
                        <h4>{q}</h4>
                    </div>
                ))}
            </div>
            <div className="flex gap-4">
                <div className="w-1/4 flex items-center">
                    <h4 className="flex items-center gap-1">{homeTeam.name} {!!homeTeam.icon && <img style={{width:"1em", height:"1em", verticalAlign: "middle"}} src={homeTeam.icon} />}</h4>
                </div>
                {periodNames.map((q, j) => (
                    <div key={j} className="w-1/4">
                        <input
                            type="number"
                            value={formStore.team1Scores[j] ?? ''}
                            className="input input-bordered w-full max-w-xs bg-base-200 focus:bg-primary focus:text-primary-content"
                            onChange={(e) => handleScoreChange(TEAM_INDEX.HOME, j, e.target.value)}
                        />
                    </div>
                ))}
            </div>
            <div className="flex gap-4">
                <div className="w-1/4 flex items-center">
                    <h4 className="flex items-center gap-1">{awayTeam.name} {!!awayTeam.icon && <img style={{width:"1em", height:"1em", verticalAlign: "middle"}} src={awayTeam.icon} />}</h4>
                </div>
                {periodNames.map((q, j) => (
                    <div key={j} className="w-1/4">
                        <input
                            type="number"
                            value={formStore.team2Scores[j] ?? ''}
                            className="input input-bordered w-full max-w-xs bg-base-200 focus:bg-primary focus:text-primary-content"
                            onChange={(e) => handleScoreChange(TEAM_INDEX.AWAY, j, e.target.value)}
                        />
                    </div>
                ))}
            </div>
            <div className="flex gap-4">
                <div className="w-1/4 flex items-center">
                    <h4>Tiebreaker</h4>
                </div>
                {periodNames.map((q, j) => (
                    <div key={j} className="w-1/4">
                        {j !== QUARTERS.FINAL && <>
                            <input
                                type="number"
                                value={formStore.tiebreakers[j] ?? ''}
                                className="input input-bordered input-sm w-full max-w-xs bg-base-200 focus:bg-primary focus:text-primary-content"
                                onChange={(e) => handleTiebreakerChange(j, e.target.value)}
                            />
                            <small className="form-text text-base-300 text-xs">
                                {tiebreakerTexts[j] || 'Tiebreaker info unavailable'}
                            </small>
                        </>}
                    </div>
                ))}
            </div>
        </div>

        {/* Mobile layout - vertical cards */}
        <div className="md:hidden space-y-4">
            {periodNames.map((q, j) => (
                <div key={j} className="bg-base-100 rounded-lg p-4 border border-base-300">
                    <h4 className="text-lg font-semibold mb-4 text-center">{q}</h4>
                    
                    <div className="space-y-3">
                        {/* Home team */}
                        <div className="flex items-center justify-between">
                            <h5 className="flex items-center gap-2 flex-1">
                                {homeTeam.name}
                                {!!homeTeam.icon && <img style={{width:"1.2em", height:"1.2em", verticalAlign: "middle"}} src={homeTeam.icon} />}
                            </h5>
                            <input
                                type="number"
                                value={formStore.team1Scores[j] ?? ''}
                                className="input input-bordered w-20 bg-base-200 focus:bg-primary focus:text-primary-content"
                                onChange={(e) => handleScoreChange(TEAM_INDEX.HOME, j, e.target.value)}
                            />
                        </div>
                        
                        {/* Away team */}
                        <div className="flex items-center justify-between">
                            <h5 className="flex items-center gap-2 flex-1">
                                {awayTeam.name}
                                {!!awayTeam.icon && <img style={{width:"1.2em", height:"1.2em", verticalAlign: "middle"}} src={awayTeam.icon} />}
                            </h5>
                            <input
                                type="number"
                                value={formStore.team2Scores[j] ?? ''}
                                className="input input-bordered w-20 bg-base-200 focus:bg-primary focus:text-primary-content"
                                onChange={(e) => handleScoreChange(TEAM_INDEX.AWAY, j, e.target.value)}
                            />
                        </div>
                        
                        {/* Tiebreaker */}
                        {j !== QUARTERS.FINAL && (
                            <div className="mt-4 pt-3 border-t border-base-300">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium">Tiebreaker</span>
                                    <input
                                        type="number"
                                        value={formStore.tiebreakers[j] ?? ''}
                                        className="input input-bordered input-sm w-20 bg-base-200 focus:bg-primary focus:text-primary-content"
                                        onChange={(e) => handleTiebreakerChange(j, e.target.value)}
                                    />
                                </div>
                                <small className="form-text text-base-content/70 text-xs block">
                                    {tiebreakerTexts[j] || 'Tiebreaker info unavailable'}
                                </small>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    </>
}))

export default Scores