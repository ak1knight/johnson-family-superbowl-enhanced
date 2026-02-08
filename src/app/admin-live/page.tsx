'use client'

import React from 'react';
import LiveWinningEntryForm from "../components/LiveWinningEntryForm"
import { questions, getLatestAvailableYear } from "../../data/formdata";
import NFLThemeDropdown from '../components/NFLThemeDropdown';

const AdminLivePage = () => {
    const currentYear = getLatestAvailableYear();
    
    return (
        <div className="min-h-screen bg-base-200">
            {/* Hero section matching the main site design */}
            <div className="relative">
                {/* Background with gradient overlay */}
                <div className="bg-primary text-base-100 min-h-[400px] relative rounded-b-3xl shadow-2xl">
                    {/* Animated background pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-10 left-10 w-32 h-32 bg-secondary rounded-full animate-pulse"></div>
                        <div className="absolute top-32 right-20 w-20 h-20 bg-accent rounded-full animate-[bounce_4s_ease-in-out_infinite] delay-75"></div>
                        <div className="absolute bottom-20 left-32 w-16 h-16 bg-secondary rounded-full animate-pulse delay-150"></div>
                        <div className="absolute bottom-40 right-40 w-24 h-24 bg-accent rounded-full animate-[bounce_6s_ease-in-out_infinite] delay-300"></div>
                    </div>

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/50 to-secondary/30"></div>
                    
                    <div className="container mx-auto h-full flex flex-col justify-center items-center p-8 relative z-10">
                        {/* Main Title */}
                        <div className="text-center mb-8 animate-fade-in">
                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight">
                                <span className="block text-2xl md:text-3xl lg:text-4xl font-normal opacity-90 mb-2">
                                    Live Admin Dashboard
                                </span>
                                <span className="bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent drop-shadow-lg">
                                    Super Bowl {currentYear}
                                </span>
                                <span className="block text-lg md:text-xl lg:text-2xl font-normal opacity-80 mt-2">
                                    Real-Time Results Entry
                                </span>
                            </h1>
                        </div>

                        {/* Status/Info Section */}
                        <div className="mb-8 animate-slide-up">
                            <div className="text-center mb-4">
                                <p className="text-lg md:text-xl opacity-90">
                                    Enter actual game results as they happen
                                </p>
                                <p className="text-sm opacity-70 mt-2">
                                    Updates are automatically saved and reflected on the big board
                                </p>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-in-delay">
                            <div className="flex items-center gap-4 bg-secondary/20 backdrop-blur-sm rounded-full px-6 py-3">
                                <span className="text-sm opacity-90 hidden sm:inline">Team theme:</span>
                                <NFLThemeDropdown />
                            </div>
                            <a
                                href="/big_board"
                                className="btn btn-accent btn-lg gap-2"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                View Live Board
                            </a>
                        </div>
                    </div>

                    {/* Decorative football elements */}
                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-neutral/20 to-transparent"></div>
                </div>

                {/* Custom animations */}
                <style jsx>{`
                    @keyframes fade-in {
                        from { opacity: 0; transform: translateY(20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    
                    @keyframes slide-up {
                        from { opacity: 0; transform: translateY(40px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    
                    .animate-fade-in {
                        animation: fade-in 1s ease-out;
                    }
                    
                    .animate-fade-in-delay {
                        animation: fade-in 1s ease-out 0.3s both;
                    }
                    
                    .animate-slide-up {
                        animation: slide-up 1s ease-out 0.6s both;
                    }
                `}</style>
            </div>

            {/* Main content with better spacing */}
            <div className="container mx-auto px-4 py-8">
                <LiveWinningEntryForm questions={questions[currentYear]} year={parseInt(currentYear, 10)} />
            </div>
        </div>
    );
};

export default AdminLivePage;