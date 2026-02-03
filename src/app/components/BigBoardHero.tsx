'use client'

import React, { useState, useEffect } from 'react';
import NFLThemeDropdown from './NFLThemeDropdown';
import { useTheme } from '../../contexts/ThemeContext';

interface BigBoardHeroProps {
  selectedYear: number;
  onYearChange: (year: number) => void;
  availableYears: number[];
  totalEntries?: number;
}

const BigBoardHero = ({ selectedYear, onYearChange, availableYears, totalEntries }: BigBoardHeroProps) => {
  useTheme();
  const [animatedCount, setAnimatedCount] = useState(0);

  // Animate the entry count
  useEffect(() => {
    if (totalEntries && totalEntries > 0) {
      let start = 0;
      const end = totalEntries;
      const duration = 1000;
      const increment = end / (duration / 16);

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setAnimatedCount(end);
          clearInterval(timer);
        } else {
          setAnimatedCount(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(timer);
    }
  }, [totalEntries]);

  return (
    <div className="relative">
      {/* Enhanced Background with gradient overlay */}
      <div className="bg-primary text-base-100 min-h-[350px] relative rounded-b-3xl shadow-2xl">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-8 left-8 w-24 h-24 bg-secondary rounded-full animate-pulse"></div>
          <div className="absolute top-20 right-16 w-16 h-16 bg-accent rounded-full animate-bounce delay-75"></div>
          <div className="absolute bottom-16 left-20 w-20 h-20 bg-secondary rounded-full animate-pulse delay-150"></div>
          <div className="absolute bottom-32 right-32 w-32 h-32 bg-accent rounded-full animate-bounce delay-300"></div>
          
          {/* Trophy icons */}
          <div className="absolute top-16 left-1/4 text-6xl opacity-20">🏆</div>
          <div className="absolute bottom-20 right-1/4 text-4xl opacity-15">📊</div>
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/50 to-secondary/30"></div>
        
        <div className="container mx-auto h-full flex flex-col justify-center items-center p-8 relative z-10">
          {/* Main Title */}
          <div className="text-center mb-4 md:mb-8 animate-fade-in">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight">
              <span className="block text-2xl md:text-3xl lg:text-4xl font-normal opacity-90 mb-2">
                Johnson Family
              </span>
              <span className="bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">
                Charlie's Big Board
              </span>
              <span className="block text-lg md:text-xl lg:text-2xl font-normal opacity-80 mt-2">
                Super Bowl {selectedYear} Results
              </span>
            </h1>
          </div>

          {/* Stats Display */}
          <div className="mb-4 md:mb-8 animate-slide-up">
            <div className="flex flex-row flex-wrap justify-center md:grid md:grid-cols-3 gap-6 text-center">
              <div className="shrink-0 bg-secondary/20 backdrop-blur-sm rounded-xl p-6">
                <div className="text-3xl md:text-4xl font-bold text-accent mb-2">
                  {animatedCount}
                </div>
                <div className="text-sm opacity-80">Total Entries</div>
              </div>
              <div className="shrink-0 bg-secondary/20 backdrop-blur-sm rounded-xl p-6">
                <div className="text-3xl md:text-4xl font-bold text-accent mb-2">
                  {selectedYear}
                </div>
                <div className="text-sm opacity-80">Current Year</div>
              </div>
              <div className="shrink-0 bg-secondary/20 backdrop-blur-sm rounded-xl p-6">
                <div className="text-3xl md:text-4xl font-bold text-accent mb-2">
                  {availableYears.length}
                </div>
                <div className="text-sm opacity-80">Years Available</div>
              </div>
            </div>
          </div>

          {/* Year Selection */}
          <div className="mb-6 animate-fade-in-delay">
            <div className="text-center mb-4">
              <p className="text-lg opacity-90">Select a year to view results:</p>
            </div>
            
            {/* Enhanced Year Tabs */}
            <div className="bg-secondary/20 backdrop-blur-sm rounded-2xl p-2">
              <div className="flex flex-wrap justify-center gap-2">
                {availableYears.map((year) => (
                  <button
                    key={year}
                    onClick={() => onYearChange(year)}
                    className={`
                      px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform
                      ${selectedYear === year 
                        ? 'bg-accent text-accent-content shadow-lg scale-105 border-2 border-accent' 
                        : 'bg-base-100/20 text-base-100 hover:bg-base-100/30 hover:scale-105 hover:shadow-md'
                      }
                    `}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Theme Selector */}
          <div className="mt-4">
            <div className="flex items-center gap-4 bg-secondary/20 backdrop-blur-sm rounded-full px-6 py-3">
              <span className="text-sm opacity-90 hidden sm:inline">Team theme:</span>
              <NFLThemeDropdown />
            </div>
          </div>
        </div>

        {/* Decorative bottom gradient */}
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
  );
};

export default BigBoardHero;