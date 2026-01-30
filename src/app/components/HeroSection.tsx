'use client'

import React, { useState, useEffect, useMemo } from 'react';
import NFLThemeDropdown from './NFLThemeDropdown';
import { useTheme } from '../../contexts/ThemeContext';
import { superBowlDates } from '../../data/formdata';

interface HeroSectionProps {
  year: number;
}

const HeroSection = ({ year }: HeroSectionProps) => {
  useTheme();
  const [timeToGame, setTimeToGame] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  // Get Super Bowl date from configuration, fallback to first Sunday in February
  const superBowlDate = useMemo(() => {
    const superBowlDateString = superBowlDates[year.toString()] || `February 9, ${year}`;
    return new Date(`${superBowlDateString} 18:30:00 EST`);
  }, [year]);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const difference = superBowlDate.getTime() - now.getTime();

      if (difference > 0) {
        setTimeToGame({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeToGame(null);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [superBowlDate]);

  return (
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
                Johnson Family
              </span>
              <span className="bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">
                Super Bowl {year}
              </span>
              <span className="block text-lg md:text-xl lg:text-2xl font-normal opacity-80 mt-2">
                Prediction Pool
              </span>
            </h1>
          </div>

          {/* Countdown Timer */}
          {timeToGame && (
            <div className="mb-8 animate-slide-up">
              <div className="text-center mb-4">
                <p className="text-lg md:text-xl opacity-90">Game starts in:</p>
              </div>
              <div className="grid grid-cols-4 gap-4 text-center">
                {[
                  { label: 'Days', value: timeToGame.days },
                  { label: 'Hours', value: timeToGame.hours },
                  { label: 'Minutes', value: timeToGame.minutes },
                  { label: 'Seconds', value: timeToGame.seconds }
                ].map((item) => (
                  <div key={item.label} className="bg-secondary/20 backdrop-blur-sm rounded-xl p-4 min-w-[80px]">
                    <div className="text-2xl md:text-3xl font-bold text-accent">{item.value}</div>
                    <div className="text-sm opacity-80">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Call to Action */}
          <div className="text-center mb-6 animate-fade-in-delay">
            <p className="text-lg md:text-xl opacity-90 max-w-2xl">
              Make your predictions for quarter scores, prop bets, and more. 
              Join the family tradition and see who knows football best!
            </p>
          </div>

          {/* Theme Selector positioned in hero */}
          <div className="mt-4">
            <div className="flex items-center gap-4 bg-secondary/20 backdrop-blur-sm rounded-full px-6 py-3">
              <span className="text-sm opacity-90 hidden sm:inline">Choose your team theme:</span>
              <NFLThemeDropdown />
            </div>
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
  );
};

export default HeroSection;