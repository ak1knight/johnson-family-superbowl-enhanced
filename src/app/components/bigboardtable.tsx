import data from '../../data'
import { useState, useEffect } from 'react';
import { teams, periodNames, Entry, AnsweredQuestion } from "../../data/formdata";

function formatScore(entry: Entry, quarter: string, year: string) {
    if (!entry[teams[year][0].name] || !entry[teams[year][1].name])
        return
    const firstTeamScore = parseInt((entry[teams[year][0].name]?.[quarter as typeof periodNames[number]]?.score || '0').toString());
    const secondTeamScore = parseInt((entry[teams[year][1].name]?.[quarter as typeof periodNames[number]]?.score || '0').toString());
    return firstTeamScore == secondTeamScore ? `${firstTeamScore} - ${secondTeamScore} Tie`
        : firstTeamScore > secondTeamScore ? `${firstTeamScore} - ${secondTeamScore} ${teams[year][0].name}`
            : `${secondTeamScore} - ${firstTeamScore} ${teams[year][1].name}`
}

const finalColors = ['bg-primary text-primary-content border-primary', 'bg-secondary text-secondary-content border-primary', 'bg-accent text-accent-content border-primary']

function toSeconds(str: string) {
    if (str.includes(":")) {
        const pieces = str.split(":");
        const result = Number(pieces[0]) * 60 + Number(pieces[1]);
        return (result);
    } else {
        return Number(str);
    }
}

type WinningNumbers = {
    "Quarter 1"?: number, 
    "Quarter 2"?: number, 
    "Quarter 3"?: number, 
    "Final"?: number, 
    topthree?: [first: number, second: number, third: number],
    anthemLength?: number
}

const BigBoardTable = ({year}: {year: string | number}) => {
    const [entries, setEntries] = useState<Array<{entry: Entry, yearKey: string | number, id: number}>>();
    const [winningEntry, setWinningEntry] = useState<{entry: Entry, yearKey: string | number}>();
    const [winningNumbers, setWinningNumbers] = useState<WinningNumbers>({});

    useEffect(() => {
        setEntries(undefined)
        setWinningEntry(undefined);

        async function fetchData() {
            const [entryResponse, winningEntryResponse] = await Promise.all([fetch(`/api/entry/${year}`), fetch(`/api/winningentry/${year}`)]);
            setEntries(await entryResponse.json());
            setWinningEntry(await winningEntryResponse.json());
        }

        fetchData();
    }, [year]);

    useEffect(() => {
        const wn:WinningNumbers = {};
        setWinningNumbers({});

        if (!winningEntry || Object.keys(winningEntry.entry).length === 0 || !winningEntry.entry[teams[year][0].name]) {
            return
        }

        periodNames.forEach(period => {
            if (!!winningEntry?.entry?.[teams[year][0].name]?.[period as keyof typeof periodNames[number]] && !!winningEntry.entry[teams[year][0].name][period as keyof typeof periodNames].score) {
                wn[period] = Math.min(...entries.map((e) => Math.abs(e.entry[teams[year][0].name][period].score - winningEntry.entry[teams[year][0].name][period].score) + Math.abs(e.entry[teams[year][1].name][period].score - winningEntry.entry[teams[year][1].name][period].score)));
            }
        });

        if (!!winningEntry.entry[teams[year][0].name]["Final"] && !!winningEntry.entry[teams[year][0].name]["Final"].score) {
            const differences = entries.map((e) => Math.abs(e.entry[teams[year][0].name]["Final"].score - winningEntry.entry[teams[year][0].name]["Final"].score) + Math.abs(e.entry[teams[year][1].name]["Final"].score - winningEntry.entry[teams[year][1].name]["Final"].score))
            console.log(differences);
            const first = Math.min(...differences);
            const second = Math.min(...differences.filter(d => d > first));
            const third = Math.min(...differences.filter(d => d > second));
            wn.topthree = [first, second, third];
            console.log(first, second, third);
        }

        teams[year].forEach(team => {
            if (winningEntry.entry[team.name].yards) {
                wn[team.name] = Math.min(...entries.map(e => Math.abs(e.entry[team.name].yards - winningEntry.entry[team.name].yards)));
            }
        })

        if (!!winningEntry.entry[0].response) {
            wn.anthemLength = Math.min(...entries.map(e => Math.abs(toSeconds(e.entry[0].response) - toSeconds(winningEntry.entry[0].response))));
        }

        setWinningNumbers(wn);
    }, [winningEntry])

    function checkWinningScore(entry: Entry, period: "Quarter 1" | "Quarter 2" | "Quarter 3" | "Final") {
        return !!winningNumbers && !!winningEntry && !!winningEntry.entry[teams[year][0].name] && !!winningEntry.entry[teams[year][1].name] && !!winningEntry.entry[teams[year][0].name][period] && Math.abs(entry[teams[year][0].name][period].score - winningEntry.entry[teams[year][0].name][period].score) + Math.abs(entry[teams[year][1].name][period].score - winningEntry.entry[teams[year][1].name][period].score) == winningNumbers[period];
    }

    function checkFinalScore(entry: Entry) {
        return !!winningNumbers?.topthree && !!winningEntry && !!winningEntry.entry[teams[year][0].name] && !!winningEntry.entry[teams[year][1].name] && !!winningEntry.entry[teams[year][0].name]["Final"] && winningNumbers.topthree.indexOf(Math.abs(entry[teams[year][0].name]["Final"].score - winningEntry.entry[teams[year][0].name]["Final"].score) + Math.abs(entry[teams[year][1].name]["Final"].score - winningEntry.entry[teams[year][1].name]["Final"].score));
    }

    function checkTiebreaker(entry: Entry, period: "Quarter 1" | "Quarter 2" | "Quarter 3" | "Final") {
        return !!winningNumbers && !!winningEntry && !!winningEntry.entry[period]?.tiebreaker && Math.abs(entry[period].tiebreaker - winningEntry.entry[period].tiebreaker) == Math.min(...entries.filter(e => checkWinningScore(e.entry, period)).map(e => Math.abs(e.entry[period].tiebreaker - winningEntry.entry[period].tiebreaker)));
    }

    function checkWinningYards(entry: Entry, team: string | number) {
        return !!winningNumbers && !!winningEntry && !!winningEntry.entry[team] && Math.abs(entry[team].yards - winningEntry.entry[team].yards) == winningNumbers[team];
    }

    function checkWinningAnthemTime(entry: Entry) {
        return !!winningNumbers && !!winningEntry && !!winningEntry.entry[0].response && Math.abs(toSeconds(entry[0].response) - toSeconds(winningEntry.entry[0].response)) == winningNumbers.anthemLength;
    }

    return <table className="table table-sm border-top-0" style={{width: "calc(100% - 2px)"}}>
        <thead>
            <tr>
                <th className="border-top-0" scope="col">Name</th>
                <th className="border-top-0 text-center" scope="col">Anthem Time</th>
                {!!periodNames && periodNames.map((q, i) => <th key={i} className="border-top-0 text-center" scope="col">{`${q} Score`}</th>)}
                {!!teams[year] && teams[year].map((t, i) => <th key={i} className="border-top-0 text-center" scope="col">{`${t.name} Yards`}</th>)}
            </tr>
        </thead>
        <tbody>
            {!!entries ? entries.map(e => {
                const finalPlace = checkFinalScore(e.entry);
                console.log(finalPlace);

                return <tr key={e.id}>
                    <th scope="row">{e.entry.name}</th>
                    <td className={checkWinningAnthemTime(e.entry) ? 'bg-primary text-white border border-primary text-center' : 'text-center'} >{e.entry[0].response}</td>
                    {periodNames.slice(0, 3).map((q, i) => <td className={checkWinningScore(e.entry, q) ? `${checkTiebreaker(e.entry, q) ? `bg-primary text-white` : `text-primary bg-light`} border-primary border text-center` : 'text-center'} key={i}>{formatScore(e.entry, q, year)}</td>)}
                    <td className={finalPlace !== false && finalPlace > -1 ? `${finalColors[finalPlace]} border text-center` : 'text-center'}>{finalPlace !== false && finalPlace > -1 && <span className="badge badge-light">{finalPlace + 1}</span>} {formatScore(e.entry, 'Final', year)}</td>
                    {teams[year].map((t, i) => <td className={checkWinningYards(e.entry, t.name) ? 'bg-primary text-white border border-primary text-center' : 'text-center'} key={i}>{e.entry[t.name]?.yards}</td>)}
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

// BigBoardTable.getInitialProps = async ({ req }) => {
//     if (req) {
//         // this is server side
//         // is fine to use aws-sdk here
//         return {
//             entries: await data.readEntries()
//         };
//     } else {
//         // we are client side
//         // fetch via api
//         const response = await fetch('/api/entry')
//         return { entries: await response.json() }
//     }
// }

export default BigBoardTable
