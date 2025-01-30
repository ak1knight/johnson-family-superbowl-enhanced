import React, { useContext} from "react"
import Card from "./card"
import { teams } from "../../data/formdata";
import { FormContext } from "@/data/form-context";

const extrainfo = ''

const Yards = React.forwardRef<HTMLDivElement>(function Yards() {
    const formStore = useContext(FormContext);
    return <Card id="yards" title="Total Yards" extrainfo={extrainfo}>
        <div className="row" >
            <div className="col-md">
                <h4>{teams[formStore.year][0].name} {!!teams[formStore.year][0].icon && <img style={{width:"1em", height:"1em", verticalAlign: "middle"}} src={teams[formStore.year][0].icon} />}</h4>
                <input type="number" value={formStore.team1Yards} className="form-control" onChange={(e) => formStore.team1Yards = parseInt(e.target.value)} ></input>
            </div>
            <div className="col-md">
                <h4>{teams[formStore.year][1].name} {!!teams[formStore.year][1].icon && <img style={{width:"1em", height:"1em", verticalAlign: "middle"}} src={teams[formStore.year][1].icon} />}</h4>
                <input type="number" value={formStore.team2Yards} className="form-control" onChange={(e) => formStore.team2Yards = parseInt(e.target.value)} ></input>
            </div>
        </div>
    </Card>
})

export default Yards