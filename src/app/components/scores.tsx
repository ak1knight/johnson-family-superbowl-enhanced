import React, { useContext } from "react"
import Card from "./card"
import { periodNames, teams, tiebreakers } from "../../data/formdata"
import { FormContext } from "@/data/form-context"

const extrainfo = ''

const Scores = React.forwardRef<HTMLDivElement>(function Scores() {
    const formStore = useContext(FormContext);
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
                <h4 className="flex items-center gap-1">{teams[formStore.year][0].name} {!!teams[formStore.year][0].icon && <img style={{width:"1em", height:"1em", verticalAlign: "middle"}} src={teams[formStore.year][0].icon} />}</h4>
            </div>
            {periodNames.map((q, j) => (
                <div key={j} className="w-1/4">
                    <input type="number" value={formStore.team1Scores[j]} className="input input-bordered w-full max-w-xs bg-base-200 focus:bg-primary focus:text-primary-content" onChange={(e) => formStore.team1Scores[j] = parseInt(e.target.value)} ></input>
                </div>
            ))}
        </div>
        <div className="flex gap-4" >
            <div className="w-1/4 flex items-center">
                <h4 className="flex items-center gap-1">{teams[formStore.year][1].name} {!!teams[formStore.year][1].icon && <img style={{width:"1em", height:"1em", verticalAlign: "middle"}} src={teams[formStore.year][1].icon} />}</h4>
            </div>
            {periodNames.map((q, j) => (
                <div key={j} className="w-1/4">
                    <input type="number" value={formStore.team2Scores[j]} className="input input-bordered w-full max-w-xs bg-base-200 focus:bg-primary focus:text-primary-content" onChange={(e) => formStore.team2Scores[j] = parseInt(e.target.value)} ></input>
                </div>
            ))}
        </div>
        <div className="flex gap-4" >
            <div className="w-1/4 flex items-center">
                <h4>Tiebreaker</h4>
            </div>
            {periodNames.map((q, j) => (
                <div key={j} className="w-1/4">
                    <input type="number" value={formStore.tiebreakers[j]} className="input input-bordered input-sm w-full max-w-xs bg-base-200 focus:bg-primary focus:text-primary-content" onChange={(e) => formStore.tiebreakers[j] = parseInt(e.target.value)} ></input>
                    <small className="form-text text-base-300 text-xs">{tiebreakers[formStore.year][q]}</small>
                </div>
            ))}
        </div>
    </Card>
})

export default Scores