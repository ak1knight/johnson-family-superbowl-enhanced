'use client'

import React, { useState, useCallback, useMemo } from 'react';
import BigBoardHero from '../components/BigBoardHero';
import EnhancedBigBoardTable from '../components/EnhancedBigBoardTable';
import EnhancedPropBetTable from '../components/EnhancedPropBetTable';

type ViewType = 'scores' | 'props' | 'combined';

const CompetitionDashboard = () => {
    const [year, setYear] = useState(2025);
    const [activeView, setActiveView] = useState<ViewType>('scores');
    const [totalEntries, setTotalEntries] = useState<number>(0);
    
    const availableYears = [2020, 2021, 2022, 2023, 2024, 2025, 2026];

    const handleEntriesLoad = useCallback((count: number) => {
        setTotalEntries(count);
    }, []);

    const handleYearChange = useCallback((newYear: number) => {
        setYear(newYear);
        setTotalEntries(0); // Reset count when year changes
    }, []);

    const viewTabs = useMemo(() => [
        {
            id: 'scores' as const,
            label: 'Score Predictions',
            icon: '🏈',
            description: 'Quarter-by-quarter scoring results'
        },
        {
            id: 'props' as const,
            label: 'Prop Bets',
            icon: '🎯',
            description: 'Proposition bet outcomes'
        },
        {
            id: 'combined' as const,
            label: 'Combined Rankings',
            icon: '🏆',
            description: 'Overall competition standings'
        }
    ], []);

    const renderActiveView = () => {
        switch (activeView) {
            case 'scores':
                return <EnhancedBigBoardTable year={year} onEntriesLoad={handleEntriesLoad} />;
            case 'props':
                return <EnhancedPropBetTable year={year} onEntriesLoad={handleEntriesLoad} />;
            case 'combined':
                return (
                    <div className="space-y-8">
                        <div className="card bg-info/10 border border-info/20">
                            <div className="card-body">
                                <div className="flex items-center gap-3">
                                    <span className="text-3xl">🚧</span>
                                    <div>
                                        <h3 className="text-xl font-semibold text-info">Combined Rankings Coming Soon!</h3>
                                        <p className="text-info/80">We're working on a unified scoring system that combines both score predictions and prop bet performance.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Preview of both tables */}
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <h4 className="text-lg font-semibold text-base-content flex items-center gap-2">
                                    <span>🏈</span> Score Predictions Preview
                                </h4>
                                <EnhancedBigBoardTable year={year} onEntriesLoad={handleEntriesLoad} />
                            </div>
                            
                            <div className="space-y-4">
                                <h4 className="text-lg font-semibold text-base-content flex items-center gap-2">
                                    <span>🎯</span> Prop Bets Preview
                                </h4>
                                <EnhancedPropBetTable year={year} onEntriesLoad={handleEntriesLoad} />
                            </div>
                        </div>
                    </div>
                );
            default:
                return <EnhancedBigBoardTable year={year} onEntriesLoad={handleEntriesLoad} />;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral via-base-100 to-neutral/50">
            {/* Enhanced Hero Section */}
            <BigBoardHero 
                selectedYear={year}
                onYearChange={handleYearChange}
                availableYears={availableYears}
                totalEntries={totalEntries}
            />

            {/* Main Content Container */}
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-7xl mx-auto space-y-8">
                    <div className="tabs tabs-boxed bg-base-200/50 p-2 rounded-2xl items-center">
                        {viewTabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveView(tab.id)}
                                className={`
                                    tab h-full flex-1 transition-all duration-200 rounded-xl pb-2
                                    ${activeView === tab.id 
                                        ? 'tab-active bg-primary text-primary-content shadow-lg' 
                                        : 'hover:bg-base-300/50 hover:scale-102'
                                    }
                                `}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-xl">{tab.icon}</span>
                                    <div className="hidden md:block text-left">
                                        <div className="font-semibold">{tab.label}</div>
                                        <div className="text-xs opacity-70">{tab.description}</div>
                                    </div>
                                    <div className="md:hidden font-semibold">{tab.label}</div>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Active View Content */}
                    <div className="animate-fade-in">
                        {renderActiveView()}
                    </div>

                    {/* Competition Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Competition Overview */}
                        <div className="card bg-base-100/80 backdrop-blur-sm shadow-lg border border-base-300/50">
                            <div className="card-body">
                                <h3 className="card-title text-lg">📊 Competition Overview</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between items-center">
                                        <span>Current Year:</span>
                                        <div className="badge badge-primary font-semibold">{year}</div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span>Total Participants:</span>
                                        <div className="badge badge-secondary font-semibold">{totalEntries}</div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span>Active View:</span>
                                        <div className="badge badge-accent font-semibold">
                                            {viewTabs.find(tab => tab.id === activeView)?.label}
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span>Historical Years:</span>
                                        <div className="badge badge-info font-semibold">{availableYears.length}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="card bg-base-100/80 backdrop-blur-sm shadow-lg border border-base-300/50">
                            <div className="card-body">
                                <h3 className="card-title text-lg">⚡ Quick Actions</h3>
                                <div className="space-y-3">
                                    <button 
                                        className="btn btn-primary btn-sm w-full"
                                        onClick={() => window.location.href = '/'}
                                    >
                                        📝 Submit New Entry
                                    </button>
                                    <button 
                                        className="btn btn-secondary btn-sm w-full"
                                        onClick={() => setYear(Math.max(...availableYears))}
                                    >
                                        🆕 Latest Year ({Math.max(...availableYears)})
                                    </button>
                                    <button 
                                        className="btn btn-outline btn-sm w-full"
                                        onClick={() => {
                                            const currentIndex = availableYears.indexOf(year);
                                            const nextYear = availableYears[(currentIndex + 1) % availableYears.length];
                                            setYear(nextYear);
                                        }}
                                    >
                                        🔄 Next Year
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* View Guide */}
                        <div className="card bg-base-100/80 backdrop-blur-sm shadow-lg border border-base-300/50">
                            <div className="card-body">
                                <h3 className="card-title text-lg">📋 View Guide</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <span className="w-4 h-4 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded"></span>
                                        <span>1st Place Winner</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-4 h-4 bg-success rounded"></span>
                                        <span>Perfect Match</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-4 h-4 bg-primary rounded"></span>
                                        <span>High Scorer</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-4 h-4 bg-warning rounded"></span>
                                        <span>Close Call</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom animations */}
            <style jsx>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                .animate-fade-in {
                    animation: fade-in 0.6s ease-out;
                }
                
                .hover\\:scale-102:hover {
                    transform: scale(1.02);
                }
            `}</style>
        </div>
    );
};

export default CompetitionDashboard;