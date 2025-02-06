import React, { useState, useEffect } from 'react';
import { Entry, questions } from "../../data/formdata";

const PropBetBoardTable = ({year}: {year: string | number}) => {
    const [entries, setEntries] = useState<Array<{entry: Entry, yearKey: string | number, id: number}>>();
    const [winningEntry, setWinningEntry] = useState<{entry: Entry, yearKey: string | number}>();
    
    useEffect(() => {
        setEntries(undefined)
        setWinningEntry(undefined)

        async function fetchData() {
            const [entryResponse, winningEntryResponse] = await Promise.all([fetch(`/api/entry/${year}`), fetch(`/api/winningentry/${year}`)]);
            setEntries(await entryResponse.json());
            setWinningEntry(await winningEntryResponse.json());
        }

        fetchData();
    }, [year]);

    console.log(winningEntry);
    console.log(year);

    if (entries) {
        entries.sort((e1, e2) => 
            questions[year].slice(1).map((q, i) => !!winningEntry && winningEntry.yearKey === year && !!winningEntry.entry[i + 1] && e2.entry[i + 1].response == winningEntry.entry[i + 1].response ? q.options!.find(o => o.name == winningEntry.entry[i + 1].response)!.score : 0).reduce((a,b) => a + b, 0) -
            questions[year].slice(1).map((q, i) => !!winningEntry && winningEntry.yearKey === year && !!winningEntry.entry[i + 1] && e1.entry[i + 1].response == winningEntry.entry[i + 1].response ? q.options!.find(o => o.name == winningEntry.entry[i + 1].response)!.score : 0).reduce((a,b) => a + b, 0)
        )
    }

    return <table className="table table-sm border-top-0">
        <thead>
            <tr>
                <th className="border-top-0" scope="col"></th>
                <th className="border-top-0" scope="col">Name</th>
                {!!questions[year] && questions[year].slice(1).map((q, i) => <th key={i} className="border-top-0" scope="col">{q.short}</th>)}
                <th className="border-top-0" scope="col">Total</th>
            </tr>
        </thead>
        <tbody>
            {!!entries && entries[0].yearKey === year ? entries.map((e, i, arr) => {
                const entryScore = questions[year].slice(1).map((q, i) => !!winningEntry && winningEntry.yearKey === year && !!winningEntry.entry[i + 1] && e.entry[i + 1].response == winningEntry.entry[i + 1].response ? q.options!.find(o => o.name == winningEntry.entry[i + 1].response)!.score : 0).reduce((a,b) => a + b, 0);
                const rank = arr.slice().map(a => questions[year].slice(1).map((q, i) => !!winningEntry && winningEntry.yearKey === year && !!winningEntry.entry[i + 1] && a.entry[i + 1].response == winningEntry.entry[i + 1].response ? q.options!.find(o => o.name == winningEntry.entry[i + 1].response)!.score : 0).reduce((a,b) => a + b, 0)).indexOf(entryScore);

                return <tr key={e.id} style={entryScore > 0 && rank < 5 ? {backgroundColor: `rgb(${193 + (rank * (62 / 5))},${226 + (rank * (29 / 5))},${255 + (rank * (0 / 5))})`} : {}}>
                    <th scope="row text-center"><span className="badge badge-light">{rank + 1}</span></th>
                    <th scope="row">{e.entry.name}</th>
                    {questions[year].slice(1).map((q, i) => <td className={!!winningEntry && winningEntry.yearKey === year && !!winningEntry.entry[i + 1] && e.entry[i + 1].response == winningEntry.entry[i + 1].response ? 'text-success font-weight-bold' : ''} key={i}>{e.entry[i + 1].response as string}</td>)}
                    <td className="font-weight-bold">{questions[year].slice(1).map((q, i) => !!winningEntry && winningEntry.yearKey === year && !!winningEntry.entry[i + 1] && e.entry[i + 1].response == winningEntry.entry[i + 1].response ? q.options!.find(o => o.name == winningEntry.entry[i + 1].response)!.score : 0).reduce((a,b) => a + b, 0)}</td>
                </tr>
            }) :
            <tr>
                <td className="d-flex justify-content-center">
                    <div className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </td>
            </tr>}
        </tbody>
    </table>
}

export default PropBetBoardTable
