'use client'

import React, { useState, useMemo } from 'react'
import EntryForm from "./components/entryform"
import HeroSection from "./components/HeroSection"
import FormProgress from "./components/FormProgress"
import { questions } from "../data/formdata";
import { FormContext, FormStore } from '@/data/form-context';
import { observer } from 'mobx-react';

// Single source of truth for the current year
const CURRENT_YEAR = 2026;

const HomeContent = observer(() => {
    const [year] = useState(CURRENT_YEAR);
    const [currentStep] = useState(0);
    const formStore = React.useContext(FormContext);

    // Define form sections for progress tracking
    const sectionNames = useMemo(() => [
        'Team Scores',
        'Yardage Predictions',
        ...questions[year].map(q => q.question.length > 30 ? q.question.substring(0, 30) + '...' : q.question),
        'Personal Information'
    ], [year]);

    // Track completed sections based on form data
    const completedSections = useMemo(() => {
        const completed = [];
        
        // Check if scores are filled (all 4 quarters for both teams)
        const team1Complete = formStore.team1Scores.every(s => s !== undefined && s !== null);
        const team2Complete = formStore.team2Scores.every(s => s !== undefined && s !== null);
        const tiebreakerComplete = formStore.tiebreakers.slice(0, 3).every(t => t !== undefined && t !== null);
        if (team1Complete && team2Complete && tiebreakerComplete) {
            completed.push('Team Scores');
        }
        
        // Check if tiebreakers are filled (first 3 quarters required)
        const yardageComplete = formStore.team1Yards !== undefined && formStore.team2Yards !== undefined;
        if (yardageComplete) {
            completed.push('Yardage Predictions');
        }
        
        // Check individual questions
        questions[year].forEach((q, index) => {
            if (formStore.questionAnswers[index]?.trim()) {
                const sectionName = q.question.length > 30 ? q.question.substring(0, 30) + '...' : q.question;
                completed.push(sectionName);
            }
        });
        
        // Check if name is filled
        if (formStore.name.trim()) {
            completed.push('Personal Information');
        }
        
        return completed;
    }, [
        formStore.team1Scores[0], formStore.team1Scores[1], formStore.team1Scores[2], formStore.team1Scores[3],
        formStore.team2Scores[0], formStore.team2Scores[1], formStore.team2Scores[2], formStore.team2Scores[3],
        formStore.tiebreakers[0], formStore.tiebreakers[1], formStore.tiebreakers[2],
        formStore.team1Yards, formStore.team2Yards,
        formStore.questionAnswers.join(','), // Join to create a single dependency
        formStore.name,
        year
    ]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral via-base-100 to-neutral/50">
            {/* Enhanced Hero Section */}
            <HeroSection year={year} />

            {/* Main Content Container */}
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Desktop Sidebar - Progress Indicator */}
                    <div className="lg:col-span-3 order-2 lg:order-1">
                        <div className="hidden lg:block sticky top-4 h-fit">
                            <FormProgress
                                currentStep={currentStep}
                                totalSteps={sectionNames.length}
                                completedSections={completedSections}
                                sectionNames={sectionNames}
                            />
                        </div>
                    </div>

                    {/* Main Form Content */}
                    <div className="lg:col-span-9 order-1 lg:order-2">
                        {/* Mobile Progress Indicator - Sticky */}
                        <div className="lg:hidden mb-6 sticky top-0 z-50">
                            <div className="bg-base-100/95 backdrop-blur-md rounded-2xl p-4 border border-base-300/50 shadow-lg mx-2">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="font-semibold">Progress</h3>
                                    <span className="text-sm text-base-content/70">
                                        {completedSections.length}/{sectionNames.length}
                                    </span>
                                </div>
                                <div className="w-full bg-base-300 rounded-full h-2.5">
                                    <div
                                        className="bg-gradient-to-r from-primary to-secondary h-full rounded-full transition-all duration-500 relative overflow-hidden"
                                        style={{ width: `${(completedSections.length / sectionNames.length) * 100}%` }}
                                    >
                                        {/* Animated shimmer effect for mobile too */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Form Content */}
                        <div className="space-y-6">
                            <EntryForm year={year} questions={questions[year]} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Add shimmer animation for mobile progress */}
            <style jsx>{`
                @keyframes shimmer {
                    0% { transform: translateX(-100%) skewX(-12deg); }
                    100% { transform: translateX(200%) skewX(-12deg); }
                }
                
                .animate-shimmer {
                    animation: shimmer 2s infinite;
                }
            `}</style>

            {/* Footer with helpful tips */}
            <footer className="bg-base-200/50 backdrop-blur-sm border-t border-base-300/50 mt-16">
                <div className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                        <div>
                            <div className="text-2xl mb-2">🏈</div>
                            <h4 className="font-semibold mb-2">Make Your Predictions</h4>
                            <p className="text-sm text-base-content/70">
                                Predict quarter scores, yardage, and answer prop bet questions
                            </p>
                        </div>
                        <div>
                            <div className="text-2xl mb-2">🎯</div>
                            <h4 className="font-semibold mb-2">Track Your Progress</h4>
                            <p className="text-sm text-base-content/70">
                                Use the progress indicator to see which sections you've completed
                            </p>
                        </div>
                        <div>
                            <div className="text-2xl mb-2">🏆</div>
                            <h4 className="font-semibold mb-2">Win Prizes</h4>
                            <p className="text-sm text-base-content/70">
                                See how you rank against family members on the Big Board
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
});

const Home = () => {
    const [year] = useState(CURRENT_YEAR);
    const formStore = useMemo(() => new FormStore(year.toString()), [year]);

    return (
        <FormContext.Provider value={formStore}>
            <HomeContent />
        </FormContext.Provider>
    );
};

export default Home
