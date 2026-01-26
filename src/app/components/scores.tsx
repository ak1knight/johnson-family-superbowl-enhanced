import React, { useContext } from "react"
import Card from "./card"
import { periodNames, tiebreakers } from "../../data/formdata"
import { FormContext, QUARTERS, TEAM_INDEX } from "@/data/form-context"
import { observer } from "mobx-react"

const extrainfo = ''

// Helper function to parse score input with validation
const parseScore = (value: string): number | undefined => {
    const parsed = parseInt(value);
    return isNaN(parsed) ? undefined : Math.max(0, Math.min(999, parsed));
};

const Scores = observer(React.forwardRef<HTMLDivElement>(function Scores() {
    const formStore = useContext(FormContext);
    const homeTeam = formStore.homeTeam;
    const awayTeam = formStore.awayTeam;
    
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
                        onChange={(e) => {
                            const score = parseScore(e.target.value);
                            formStore.setTeamScore(TEAM_INDEX.HOME, j, score);
                        }}
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
                        onChange={(e) => {
                            const score = parseScore(e.target.value);
                            formStore.setTeamScore(TEAM_INDEX.AWAY, j, score);
                        }}
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
                            onChange={(e) => {
                                const value = parseScore(e.target.value);
                                formStore.setTiebreaker(j, value);
                            }}
                        />
                        <small className="form-text text-base-300 text-xs">{tiebreakers[formStore.year][q]}</small>
                    </>}
                </div>
            ))}
        </div>
    </Card>
}))

export default Scores