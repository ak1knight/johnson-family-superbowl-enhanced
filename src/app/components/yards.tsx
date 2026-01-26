import React, { useContext} from "react"
import Card from "./card"
import { FormContext, TEAM_INDEX } from "@/data/form-context";
import { observer } from "mobx-react";

const extrainfo = ''

// Helper function to parse yards input with validation
const parseYards = (value: string): number => {
    const parsed = parseInt(value);
    return isNaN(parsed) ? 0 : Math.max(0, Math.min(9999, parsed));
};

const Yards = observer(React.forwardRef<HTMLDivElement>(function Yards() {
    const formStore = useContext(FormContext);
    const homeTeam = formStore.homeTeam;
    const awayTeam = formStore.awayTeam;
    
    return <Card id="yards" title="Total Yards" extrainfo={extrainfo}>
        <div className="flex gap-4" >
            <div className="w-1/2">
                <h4 className="flex items-center gap-1">{homeTeam.name} {!!homeTeam.icon && <img style={{width:"1em", height:"1em", verticalAlign: "middle"}} src={homeTeam.icon} />}</h4>
                <input
                    type="number"
                    value={formStore.team1Yards.toString()}
                    className="input input-bordered w-full bg-base-200 focus:bg-primary focus:text-primary-content"
                    onChange={(e) => {
                        const yards = parseYards(e.target.value);
                        formStore.setTeamYards(TEAM_INDEX.HOME, yards);
                    }}
                />
            </div>
            <div className="w-1/2">
                <h4 className="flex items-center gap-1" >{awayTeam.name} {!!awayTeam.icon && <img style={{width:"1em", height:"1em", verticalAlign: "middle"}} src={awayTeam.icon} />}</h4>
                <input
                    type="number"
                    value={formStore.team2Yards.toString()}
                    className="input input-bordered w-full bg-base-200 focus:bg-primary focus:text-primary-content"
                    onChange={(e) => {
                        const yards = parseYards(e.target.value);
                        formStore.setTeamYards(TEAM_INDEX.AWAY, yards);
                    }}
                />
            </div>
        </div>
    </Card>
}))

export default Yards