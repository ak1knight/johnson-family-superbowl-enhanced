import React, { useContext} from "react"
import Card from "./card"
import { teams } from "../../data/formdata";
import { FormContext } from "@/data/form-context";
import { observer } from "mobx-react";

const extrainfo = ''

const Yards = observer(React.forwardRef<HTMLDivElement>(function Yards() {
    const formStore = useContext(FormContext);
    return <Card id="yards" title="Total Yards" extrainfo={extrainfo}>
        <div className="flex gap-4" >
            <div className="w-1/2">
                <h4 className="flex items-center gap-1">{teams[formStore.year][0].name} {!!teams[formStore.year][0].icon && <img style={{width:"1em", height:"1em", verticalAlign: "middle"}} src={teams[formStore.year][0].icon} />}</h4>
                <input type="number" value={formStore.team1Yards.toString()} className="input input-bordered w-full bg-base-200 focus:bg-primary focus:text-primary-content" onChange={(e) => {formStore.team1Yards = parseInt(e.target.value);console.log(e)}} ></input>
            </div>
            <div className="w-1/2">
                <h4 className="flex items-center gap-1" >{teams[formStore.year][1].name} {!!teams[formStore.year][1].icon && <img style={{width:"1em", height:"1em", verticalAlign: "middle"}} src={teams[formStore.year][1].icon} />}</h4>
                <input type="number" value={formStore.team2Yards.toString()} className="input input-bordered w-full bg-base-200 focus:bg-primary focus:text-primary-content" onChange={(e) => formStore.team2Yards = parseInt(e.target.value)} ></input>
            </div>
        </div>
    </Card>
}))

export default Yards