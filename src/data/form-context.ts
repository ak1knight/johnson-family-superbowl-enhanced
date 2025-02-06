/* eslint-disable no-sparse-arrays */
import { makeAutoObservable } from "mobx"
import { createContext } from "react"
import { Entry, TeamName, teams, TeamScore } from "./formdata";

export class FormStore {
    year: string;
    team1Scores: [number | undefined, number | undefined, number | undefined, number | undefined] = [,,,,];
    team2Scores: [number | undefined, number | undefined, number | undefined, number | undefined] = [,,,,];
    team1Yards: number = 0;
    team2Yards: number = 0;
    tiebreakers: [number | undefined, number | undefined, number | undefined, number | undefined] = [,,,,];
    questionAnswers: string[] = [];
    name: string = ''

    constructor(year: string = '2025') {
        this.year = year;
        makeAutoObservable(this)
    }

    get readyToSubmit() {
        console.log(this)
        return !this.team1Scores.some(s => s === undefined) &&
            !this.team2Scores.some(s => s === undefined) &&
            !this.tiebreakers.some((s, i) => i !== 3 && s === undefined) &&
            !!this.name
    }

    get entry(): Entry {
        return {
            [teams[this.year][0].name as TeamName]: {
                "Quarter 1": {
                    score: this.team1Scores[0]
                },
                "Quarter 2": {
                    score: this.team1Scores[1]
                },
                "Quarter 3": {
                    score: this.team1Scores[2]
                },
                "Final": {
                    score: this.team1Scores[3]
                },
                yards: this.team1Yards
            } as TeamScore,
            [teams[this.year][1].name as TeamName]: {
                "Quarter 1": {
                    score: this.team2Scores[0]
                },
                "Quarter 2": {
                    score: this.team2Scores[1]
                },
                "Quarter 3": {
                    score: this.team2Scores[2]
                },
                "Final": {
                    score: this.team2Scores[3]
                },
                yards: this.team2Yards
            } as TeamScore,
            "Quarter 1": {
                tiebreaker: this.tiebreakers[0] || 0
            },
            "Quarter 2": {
                tiebreaker: this.tiebreakers[1] || 0
            },
            "Quarter 3": {
                tiebreaker: this.tiebreakers[2] || 0
            },
            "Final": {
                tiebreaker: this.tiebreakers[3] || 0
            },
            name: this.name,
            ...this.questionAnswers.map(a => ({response: a}))
        }
    }
}

export const FormContext = createContext<FormStore>(new FormStore())