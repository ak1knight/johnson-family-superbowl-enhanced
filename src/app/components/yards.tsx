import React, { useContext, useMemo, useCallback } from "react"
import Card from "./card"
import { FormContext, TEAM_INDEX } from "@/data/form-context";
import { observer } from "mobx-react";
import { useDebouncedCallback, usePerformanceMonitor, memoizeWithLRU } from "../../utils/performance";

const extrainfo = ''

// Memoized helper function to parse yards input with validation
const parseYards = memoizeWithLRU((value: string): number => {
    const parsed = parseInt(value);
    return isNaN(parsed) ? 0 : Math.max(0, Math.min(9999, parsed));
}, 100);

const Yards = observer(React.forwardRef<HTMLDivElement>(function Yards() {
    const formStore = useContext(FormContext);
    
    // Performance monitoring
    usePerformanceMonitor('Yards', process.env.NODE_ENV === 'development');

    // Memoize team data to avoid recalculation
    const { homeTeam, awayTeam } = useMemo(() => ({
        homeTeam: formStore.homeTeam,
        awayTeam: formStore.awayTeam
    }), [formStore.homeTeam, formStore.awayTeam]);

    // Debounced yards update function
    const debouncedSetTeamYards = useDebouncedCallback((teamIndex: 0 | 1, yards: number) => {
        formStore.setTeamYards(teamIndex, yards);
    }, 300, [formStore]);

    // Optimized yards change handler
    const handleYardsChange = useCallback((teamIndex: 0 | 1, value: string) => {
        const yards = parseYards(value);
        debouncedSetTeamYards(teamIndex, yards);
    }, [debouncedSetTeamYards]);
    
    return <Card id="yards" title="Total Yards" extrainfo={extrainfo}>
        <div className="flex gap-4" >
            <div className="w-1/2">
                <h4 className="flex items-center gap-1">{homeTeam.name} {!!homeTeam.icon && <img style={{width:"1em", height:"1em", verticalAlign: "middle"}} src={homeTeam.icon} />}</h4>
                <input
                    type="number"
                    value={formStore.team1Yards.toString()}
                    className="input input-bordered w-full bg-base-200 focus:bg-primary focus:text-primary-content"
                    onChange={(e) => handleYardsChange(TEAM_INDEX.HOME, e.target.value)}
                />
            </div>
            <div className="w-1/2">
                <h4 className="flex items-center gap-1" >{awayTeam.name} {!!awayTeam.icon && <img style={{width:"1em", height:"1em", verticalAlign: "middle"}} src={awayTeam.icon} />}</h4>
                <input
                    type="number"
                    value={formStore.team2Yards.toString()}
                    className="input input-bordered w-full bg-base-200 focus:bg-primary focus:text-primary-content"
                    onChange={(e) => handleYardsChange(TEAM_INDEX.AWAY, e.target.value)}
                />
            </div>
        </div>
    </Card>
}))

export default Yards