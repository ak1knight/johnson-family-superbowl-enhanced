import { makeAutoObservable, computed } from "mobx"
import { createContext } from "react"
import { Entry, TeamName, TeamScore, getHomeTeam, getAwayTeam, isValidYear } from "./formdata";

// Constants for better type safety
export const QUARTERS = {
    FIRST: 0,
    SECOND: 1,
    THIRD: 2,
    FINAL: 3
} as const;

export const TEAM_INDEX = {
    HOME: 0,
    AWAY: 1
} as const;

export const QUARTER_COUNT = 4;

// Type for validation errors
export type ValidationErrors = {
    [key: string]: string;
};

// Type for score arrays
export type ScoreArray = [number | undefined, number | undefined, number | undefined, number | undefined];

export class FormStore {
    year: string;
    team1Scores: ScoreArray = [undefined, undefined, undefined, undefined];
    team2Scores: ScoreArray = [undefined, undefined, undefined, undefined];
    team1Yards: number | undefined = undefined;
    team2Yards: number | undefined = undefined;
    tiebreakers: ScoreArray = [undefined, undefined, undefined, undefined];
    questionAnswers: string[] = [];
    name: string = ''

    // Performance tracking (non-observable)
    private _entryGenerationCount = 0;
    private _lastEntryGeneration = 0;

    constructor(year: string = '2025') {
        this.year = year;
        makeAutoObservable(this, {
            // Mark expensive computations as computed for automatic caching
            homeTeam: computed,
            awayTeam: computed,
            entry: computed,
            readyToSubmit: computed,
        })
    }

    // Performance monitoring getter
    get performanceStats() {
        return {
            entryGenerationCount: this._entryGenerationCount,
            lastEntryGeneration: this._lastEntryGeneration,
        };
    }

    // Helper methods for better data access with error handling
    get homeTeam() {
        try {
            return getHomeTeam(this.year);
        } catch (error) {
            console.error('Error getting home team:', error);
            throw new Error(`Failed to get home team for year ${this.year}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    get awayTeam() {
        try {
            return getAwayTeam(this.year);
        } catch (error) {
            console.error('Error getting away team:', error);
            throw new Error(`Failed to get away team for year ${this.year}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    getTeam(index: 0 | 1) {
        try {
            return index === TEAM_INDEX.HOME ? this.homeTeam : this.awayTeam;
        } catch (error) {
            console.error(`Error getting team at index ${index}:`, error);
            throw new Error(`Failed to get team at index ${index} for year ${this.year}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    // Validate year when setting
    setYear(year: string) {
        if (!isValidYear(year)) {
            throw new Error(`Invalid year: ${year}. Use a year with available team data.`);
        }
        this.year = year;
    }

    // Centralized validation methods
    validateName(): string | null {
        if (!this.name.trim()) {
            return "Name is required";
        }
        if (this.name.trim().length < 2) {
            return "Name must be at least 2 characters";
        }
        return null;
    }

    validateTeamScores(teamIndex: 0 | 1): string | null {
        const scores = teamIndex === TEAM_INDEX.HOME ? this.team1Scores : this.team2Scores;
        const teamName = teamIndex === TEAM_INDEX.HOME ? "Team 1" : "Team 2";
        
        if (scores.some(s => s == null)) {
            return `All quarter scores are required for ${teamName}`;
        }
        return null;
    }

    validateTiebreakers(): string | null {
        // Only first 3 tiebreakers are required (Final is optional)
        if (this.tiebreakers.slice(0, 3).some(t => t == null)) {
            return "Tiebreakers for quarters 1-3 are required";
        }
        return null;
    }

    validateQuestion(questionIndex: number, questionText: string): string | null {
        const answer = this.questionAnswers[questionIndex];
        if (!answer || answer.trim() === '') {
            return `Answer for "${questionText}" is required`;
        }
        return null;
    }

    // Get all validation errors
    getValidationErrors(questions: Array<{question: string}> = []): ValidationErrors {
        const errors: ValidationErrors = {};

        // Validate name
        const nameError = this.validateName();
        if (nameError) errors.name = nameError;

        // Validate team scores
        const team1Error = this.validateTeamScores(TEAM_INDEX.HOME);
        if (team1Error) errors.team1Scores = team1Error;

        const team2Error = this.validateTeamScores(TEAM_INDEX.AWAY);
        if (team2Error) errors.team2Scores = team2Error;

        // Validate tiebreakers
        const tiebreakerError = this.validateTiebreakers();
        if (tiebreakerError) errors.tiebreakers = tiebreakerError;

        // Validate questions
        questions.forEach((q, index) => {
            const questionError = this.validateQuestion(index, q.question);
            if (questionError) errors[`question_${index}`] = questionError;
        });

        return errors;
    }

    // Check if form is valid
    isValid(questions: Array<{question: string}> = []): boolean {
        return Object.keys(this.getValidationErrors(questions)).length === 0;
    }

    // Legacy getter for backward compatibility
    get readyToSubmit() {
        return this.isValid();
    }

    // Helper methods for setting scores with type safety
    setTeamScore(teamIndex: 0 | 1, quarterIndex: number, score: number | undefined) {
        if (quarterIndex < 0 || quarterIndex >= QUARTER_COUNT) {
            throw new Error(`Invalid quarter index: ${quarterIndex}`);
        }
        
        if (teamIndex === TEAM_INDEX.HOME) {
            this.team1Scores[quarterIndex] = score;
        } else {
            this.team2Scores[quarterIndex] = score;
        }
    }

    setTiebreaker(quarterIndex: number, value: number | undefined) {
        if (quarterIndex < 0 || quarterIndex >= QUARTER_COUNT) {
            throw new Error(`Invalid quarter index: ${quarterIndex}`);
        }
        this.tiebreakers[quarterIndex] = value;
    }

    setTeamYards(teamIndex: 0 | 1, yards: number) {
        if (teamIndex === TEAM_INDEX.HOME) {
            this.team1Yards = yards;
        } else {
            this.team2Yards = yards;
        }
    }

    setQuestionAnswer(questionIndex: number, answer: string) {
        this.questionAnswers[questionIndex] = answer;
    }

    // Generate team score object
    private generateTeamScore(teamIndex: 0 | 1): TeamScore {
        const scores = teamIndex === TEAM_INDEX.HOME ? this.team1Scores : this.team2Scores;
        const yards = teamIndex === TEAM_INDEX.HOME ? this.team1Yards : this.team2Yards;
        
        return {
            "Quarter 1": { score: scores[QUARTERS.FIRST] ?? 0 },
            "Quarter 2": { score: scores[QUARTERS.SECOND] ?? 0 },
            "Quarter 3": { score: scores[QUARTERS.THIRD] ?? 0 },
            "Final": { score: scores[QUARTERS.FINAL] ?? 0 },
            yards: yards ?? 0
        };
    }

    get entry(): Entry {
        const startTime = performance.now();
        this._entryGenerationCount++;
        
        try {
            const homeTeam = this.homeTeam;
            const awayTeam = this.awayTeam;
            
            const entry = {
                [homeTeam.name as TeamName]: this.generateTeamScore(TEAM_INDEX.HOME),
                [awayTeam.name as TeamName]: this.generateTeamScore(TEAM_INDEX.AWAY),
                "Quarter 1": { tiebreaker: this.tiebreakers[QUARTERS.FIRST] || 0 },
                "Quarter 2": { tiebreaker: this.tiebreakers[QUARTERS.SECOND] || 0 },
                "Quarter 3": { tiebreaker: this.tiebreakers[QUARTERS.THIRD] || 0 },
                "Final": { tiebreaker: this.tiebreakers[QUARTERS.FINAL] || 0 },
                name: this.name,
                ...this.questionAnswers.map(a => ({response: a}))
            };

            this._lastEntryGeneration = performance.now() - startTime;
            return entry;
        } catch (error) {
            this._lastEntryGeneration = performance.now() - startTime;
            console.error('Error generating entry:', error);
            throw error;
        }
    }

    // Optimized batch update methods to reduce re-renders
    updateTeamScores(teamIndex: 0 | 1, scores: Partial<ScoreArray>) {
        const targetScores = teamIndex === TEAM_INDEX.HOME ? this.team1Scores : this.team2Scores;
        let hasChanges = false;

        scores.forEach((score, index) => {
            if (score !== undefined && targetScores[index] !== score) {
                this.setTeamScore(teamIndex, index, score);
                hasChanges = true;
            }
        });

        return hasChanges;
    }

    updateTiebreakers(tiebreakers: Partial<ScoreArray>) {
        let hasChanges = false;

        tiebreakers.forEach((value, index) => {
            if (value !== undefined && this.tiebreakers[index] !== value) {
                this.setTiebreaker(index, value);
                hasChanges = true;
            }
        });

        return hasChanges;
    }

    updateQuestionAnswers(answers: Partial<string[]>) {
        let hasChanges = false;

        answers.forEach((answer, index) => {
            if (answer !== undefined && this.questionAnswers[index] !== answer) {
                this.setQuestionAnswer(index, answer);
                hasChanges = true;
            }
        });

        return hasChanges;
    }

    // Reset performance stats
    resetPerformanceStats() {
        this._entryGenerationCount = 0;
        this._lastEntryGeneration = 0;
    }
}

export const FormContext = createContext<FormStore>(new FormStore())