'use client'

import React, { useMemo } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface FormProgressProps {
  currentStep: number;
  totalSteps: number;
  completedSections: string[];
  sectionNames: string[];
}

const FormProgress = ({ currentStep, totalSteps, completedSections, sectionNames }: FormProgressProps) => {
  const { theme } = useTheme();
  
  const progressPercentage = useMemo(() => {
    return Math.round((completedSections.length / totalSteps) * 100);
  }, [completedSections.length, totalSteps]);

  const getStepStatus = (index: number, sectionName: string) => {
    if (completedSections.includes(sectionName)) return 'completed';
    if (index === currentStep) return 'current';
    if (index < currentStep) return 'passed';
    return 'upcoming';
  };

  return (
    <div className="sticky top-4 z-40 bg-base-100/95 backdrop-blur-sm rounded-2xl shadow-lg border border-base-300 p-4 mb-6">
      {/* Progress Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-base-content">Form Progress</h3>
        <div className="text-sm text-base-content/70">
          {completedSections.length} of {totalSteps} sections complete
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-base-content">{progressPercentage}% Complete</span>
          <span className="text-xs text-base-content/60">{totalSteps - completedSections.length} remaining</span>
        </div>
        
        <div className="w-full bg-base-300 rounded-full h-3 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-primary to-secondary h-full rounded-full transition-all duration-500 ease-out relative overflow-hidden"
            style={{ width: `${progressPercentage}%` }}
          >
            {/* Animated shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer"></div>
          </div>
        </div>
      </div>

      {/* Section Steps */}
      <div className="space-y-2">
        {sectionNames.map((sectionName, index) => {
          const status = getStepStatus(index, sectionName);
          
          return (
            <div 
              key={sectionName}
              className={`flex items-center gap-3 p-2 rounded-lg transition-all duration-200 ${
                status === 'current' ? 'bg-primary/10 border border-primary/20' : ''
              }`}
            >
              {/* Step Icon */}
              <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${
                status === 'completed' 
                  ? 'bg-success text-success-content' 
                  : status === 'current'
                  ? 'bg-primary text-primary-content animate-pulse'
                  : status === 'passed'
                  ? 'bg-warning text-warning-content'
                  : 'bg-base-300 text-base-content/60'
              }`}>
                {status === 'completed' ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : status === 'current' ? (
                  <div className="w-2 h-2 bg-current rounded-full animate-ping"></div>
                ) : (
                  <span className="text-xs font-medium">{index + 1}</span>
                )}
              </div>

              {/* Section Name */}
              <span className={`text-sm transition-colors duration-200 ${
                status === 'completed' 
                  ? 'text-success font-medium' 
                  : status === 'current'
                  ? 'text-primary font-medium'
                  : status === 'passed'
                  ? 'text-base-content'
                  : 'text-base-content/60'
              }`}>
                {sectionName}
              </span>

              {/* Status Badge */}
              {status === 'completed' && (
                <div className="ml-auto">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-success/20 text-success">
                    Complete
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      {progressPercentage === 100 && (
        <div className="mt-4 pt-4 border-t border-base-300">
          <div className="flex items-center gap-2 p-3 bg-success/10 rounded-lg border border-success/20">
            <svg className="w-5 h-5 text-success" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium text-success">Ready to submit!</span>
          </div>
        </div>
      )}

      {/* Custom animations */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default FormProgress;