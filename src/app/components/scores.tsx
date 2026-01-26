import React, { useContext, useMemo, useCallback } from "react"
import Card from "./card"
import { periodNames, getTiebreakerForQuarter, PeriodName } from "../../data/formdata"
import { FormContext, QUARTERS, TEAM_INDEX } from "@/data/form-context"
import { observer } from "mobx-react"
import { useDebouncedCallback, usePerformanceMonitor, memoizeWithLRU } from "../../utils/performance"

const extrainfo = ''

// Memoized helper function to parse score input with validation
const parseScore = memoizeWithLRU((value: string): number | undefined => {
    const parsed = parseInt(value);
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

    // Debounced score update functions
    const debouncedSetTeamScore = useDebouncedCallback((teamIndex: 0 | 1, quarterIndex: number, score: number | undefined) => {
        formStore.setTeamScore(teamIndex, quarterIndex, score);
    }, 300, [formStore]);

    const debouncedSetTiebreaker = useDebouncedCallback((quarterIndex: number, value: number | undefined) => {
        formStore.setTiebreaker(quarterIndex, value);
    }, 300, [formStore]);

    // Optimized score change handlers
    const handleScoreChange = useCallback((teamIndex: 0 | 1, quarterIndex: number, value: string) => {
        const score = parseScore(value);
        debouncedSetTeamScore(teamIndex, quarterIndex, score);
    }, [debouncedSetTeamScore]);

    const handleTiebreakerChange = useCallback((quarterIndex: number, value: string) => {
        const tiebreakerValue = parseScore(value);
        debouncedSetTiebreaker(quarterIndex, tiebreakerValue);
    }, [debouncedSetTiebreaker]);

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
    
    return <Card id={"score"} title="Score" extrainfo={extrainfo}>
        <div className="flex gap-4" >
            <div className="w-1/4">
            </div>
            {periodNames.map((q, j)  => (
                <div key={j} className="w-1/4">
                    <h4>{q}</h4>
                </div>
            ))}
        </div>
        <div className="flex gap-4" >
            <div className="w-1/4 flex items-center">
                <h4 className="flex items-center gap-1">{homeTeam.name} {!!homeTeam.icon && <img style={{width:"1em", height:"1em", verticalAlign: "middle"}} src={homeTeam.icon} />}</h4>
            </div>
            {periodNames.map((q, j) => (
                <div key={j} className="w-1/4">
                    <input
                        type="number"
                        value={formStore.team1Scores[j] || ''}
                        className="input input-bordered w-full max-w-xs bg-base-200 focus:bg-primary focus:text-primary-content"
                        onChange={(e) => handleScoreChange(TEAM_INDEX.HOME, j, e.target.value)}
                    />
                </div>
            ))}
        </div>
        <div className="flex gap-4" >
            <div className="w-1/4 flex items-center">
                <h4 className="flex items-center gap-1">{awayTeam.name} {!!awayTeam.icon && <img style={{width:"1em", height:"1em", verticalAlign: "middle"}} src={awayTeam.icon} />}</h4>
            </div>
            {periodNames.map((q, j) => (
                <div key={j} className="w-1/4">
                    <input
                        type="number"
                        value={formStore.team2Scores[j] || ''}
                        className="input input-bordered w-full max-w-xs bg-base-200 focus:bg-primary focus:text-primary-content"
                        onChange={(e) => handleScoreChange(TEAM_INDEX.AWAY, j, e.target.value)}
                    />
                </div>
            ))}
        </div>
        <div className="flex gap-4" >
            <div className="w-1/4 flex items-center">
                <h4>Tiebreaker</h4>
            </div>
            {periodNames.map((q, j) => (
                <div key={j} className="w-1/4">
                    {j !== QUARTERS.FINAL && <>
                        <input
                            type="number"
                            value={formStore.tiebreakers[j] || ''}
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
    </Card>
}))

export default Scores