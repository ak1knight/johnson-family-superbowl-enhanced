import React, { FormEvent, useContext, useState } from 'react';
import { useRouter } from "next/navigation";
import Card from "./card";
import Scores from './scores';
import Yards from './yards';
import { Question } from "../../data/formdata";
import { FormContext, ValidationErrors } from '@/data/form-context';
import Image from 'next/image';
import { observer } from 'mobx-react';
import { useDebouncedCallback, usePerformanceMonitor } from '../../utils/performance';


// let formData = {};

// teams[2023].forEach(t => {
//     formData[t.name] = { yards: '' }
//     periodNames.forEach(q => {
//         formData[t.name][q] = { score: '' };
//         formData[q] = { tiebreaker: '' }
//     })
// });

type EntryFormProps = {
    year: number,
    questions: Question[],
    isAdmin?: boolean,
    endpoint?: string,
    sectionRefs?: React.RefObject<HTMLDivElement | null>[]
}

const EntryForm = observer(({questions, isAdmin = false, endpoint = "/api/entry/new"}:EntryFormProps) => {
    const router = useRouter();
    const formStore = useContext(FormContext);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

    // Performance monitoring
    usePerformanceMonitor('EntryForm', process.env.NODE_ENV === 'development');

    // Use centralized validation from FormStore (immediate for form submission)
    const validateForm = () => {
        const errors = formStore.getValidationErrors(questions);
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Helper function to clear specific validation error with debouncing (validation only)
    const clearValidationError = useDebouncedCallback((errorKey: string) => {
        if (validationErrors[errorKey]) {
            const newErrors = {...validationErrors};
            delete newErrors[errorKey];
            setValidationErrors(newErrors);
        }
    }, 150, [validationErrors]);

    // Debounced form validation for real-time feedback

    // Pre-compute question validations at the top level to avoid hooks rule violations

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmitError(null);
        
        if (!isAdmin && !validateForm()) {
            return;
        }

        if (!isAdmin && !formStore.isValid(questions)) {
            setSubmitError('Please respond to all questions before submitting');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch(endpoint, {
                method: "POST",
                body: JSON.stringify({ entry: formStore.entry }),
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to submit entry');
            }

            router.push("/big_board");
        } catch (error) {
            setSubmitError(error instanceof Error ? error.message : 'An unexpected error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    return <form data-spy="scroll" className='flex flex-col gap-2' data-target="#form-sidebar" data-offset="0" onSubmit={handleSubmit}>
        {submitError && (
            <div className="alert alert-error mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>{submitError}</span>
            </div>
        )}
        
        <Card
            variant="glass"
            title="Quarter Scores Prediction"
            isComplete={formStore.team1Scores.length > 0 && formStore.team2Scores.length > 0 && !formStore.team1Scores.includes(undefined) && !formStore.team2Scores.includes(undefined) && !formStore.tiebreakers.slice(0, 3).includes(undefined)}
            icon={
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-primary">🏈</span>
                </div>
            }
        >
            <Scores />
            {validationErrors.team1Scores && (
                <div className="text-error text-sm mt-2">⚠️ {validationErrors.team1Scores}</div>
            )}
            {validationErrors.team2Scores && (
                <div className="text-error text-sm mt-2">⚠️ {validationErrors.team2Scores}</div>
            )}
        </Card>
        
        <Card
            variant="glass"
            title="Yardage Predictions"
            isComplete={formStore.team1Yards !== undefined && formStore.team2Yards !== undefined}
            icon={
                <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center">
                    <span className="text-secondary">📏</span>
                </div>
            }
        >
            <Yards />
            {validationErrors.tiebreakers && (
                <div className="text-error text-sm mt-2">⚠️ {validationErrors.tiebreakers}</div>
            )}
        </Card>
        
        {questions.map((q, i) => <Card
            key={i}
            id={`${q.question.toLowerCase().replace(/( |\W)/g, '')}`}
            title={<span>{q.question} <span className="text-error">*</span></span>}
            extrainfo={q.extrainfo}
            variant="glass"
            isComplete={!!formStore.questionAnswers[i]?.trim()}
            isActive={validationErrors[`question_${i}`] ? true : false}
            icon={
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-primary text-xs font-bold">{i + 1}</span>
                </div>
            }
        >
            { q.options ?
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                    {q.options.map((option, index) => {
                        const isSelected = formStore.questionAnswers[i] === option.name;
                        return (
                            <div key={index} className="relative">
                                <button
                                    type="button"
                                    name={option.name}
                                    className={`
                                        w-full p-4 min-h-24 rounded-lg border-2 transition-all duration-200
                                        flex justify-center items-center flex-wrap text-center
                                        ${isSelected
                                            ? 'bg-primary text-primary-content border-primary shadow-lg scale-105'
                                            : 'bg-base-200 hover:bg-base-300 border-base-300 hover:border-primary/50 hover:shadow-md'
                                        }
                                        ${validationErrors[`question_${i}`] ? 'border-error' : ''}
                                    `}
                                    onClick={() => {
                                        formStore.setQuestionAnswer(i, option.name);
                                        clearValidationError(`question_${i}`);
                                    }}
                                >
                                    {/* Selected indicator */}
                                    {isSelected && (
                                        <div className="absolute top-2 right-2">
                                            <svg className="w-6 h-6 text-primary-content" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    )}
                                    
                                    {/* Image */}
                                    {!!option.image && (
                                        <div className='h-16 w-16 relative mb-2'>
                                            <Image
                                                alt="option"
                                                src={option.image}
                                                className="object-contain"
                                                fill
                                            />
                                        </div>
                                    )}
                                    
                                    {/* Embed */}
                                    {!!option.embed && (
                                        <div className="w-full mb-2">
                                            <div className="aspect-video">
                                                <iframe
                                                    className="w-full h-full rounded"
                                                    src={option.embed}
                                                ></iframe>
                                            </div>
                                        </div>
                                    )}
                                    
                                    {/* Text content */}
                                    <div className="text-lg font-medium">
                                        {option.name} - {option.score}
                                    </div>
                                </button>
                            </div>
                        );
                    })}
                </div> :
                <div>
                    <input
                        type="text"
                        value={formStore.questionAnswers[i]}
                        className={`input input-bordered w-full bg-base-200 focus:bg-primary focus:text-primary-content ${validationErrors[`question_${i}`] ? 'border-error' : ''}`}
                        placeholder="Enter your answer..."
                        onChange={(e) => {
                            formStore.setQuestionAnswer(i, e.target.value);
                            clearValidationError(`question_${i}`);
                        }}
                        {...q.config}
                    />
                    {validationErrors[`question_${i}`] && (
                        <div className="text-error text-sm mt-1">⚠️ {validationErrors[`question_${i}`]}</div>
                    )}
                </div>
            }
            {validationErrors[`question_${i}`] && q.options && (
                <div className="text-error text-sm mt-2">⚠️ {validationErrors[`question_${i}`]}</div>
            )}
        </Card>)}
        
        <Card
            title={<span>Enter Your Name <span className="text-error">*</span></span>}
            variant="elevated"
            isComplete={!!formStore.name.trim()}
            icon={
                <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center">
                    <span className="text-accent">👤</span>
                </div>
            }
        >
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <div className="relative">
                        <input
                            type="text"
                            value={formStore.name}
                            className={`w-full input input-bordered input-lg bg-base-200/50 text-xl focus:bg-base-200 transition-all duration-200 ${validationErrors.name ? 'border-error focus:border-error' : 'focus:border-primary'} ${formStore.name.trim() ? 'border-success' : ''}`}
                            placeholder="Enter your full name..."
                            onChange={(e) => {
                                formStore.name = e.target.value;
                                clearValidationError('name');
                            }}
                        />
                        {formStore.name.trim() && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-success">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                        )}
                    </div>
                    {validationErrors.name && (
                        <div className="text-error text-sm mt-2 flex items-center gap-1">
                            <span>⚠️</span>
                            <span>{validationErrors.name}</span>
                        </div>
                    )}
                </div>
                
                <div className="flex-shrink-0">
                    <button
                        type="submit"
                        className={`btn btn-primary btn-lg w-full md:w-auto px-8 ${isSubmitting ? 'loading' : ''} ${Object.keys(validationErrors).length === 0 && formStore.name.trim() ? 'btn-success' : ''}`}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <span className="loading loading-spinner loading-sm"></span>
                                Submitting Entry...
                            </>
                        ) : Object.keys(validationErrors).length === 0 && formStore.name.trim() ? (
                            <>
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Submit Entry
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                                Submit Entry
                            </>
                        )}
                    </button>
                </div>
            </div>
            
            {/* Completion status */}
            {Object.keys(validationErrors).length === 0 && formStore.name.trim() && (
                <div className="mt-4 p-3 bg-success/10 border border-success/20 rounded-lg flex items-center gap-2">
                    <svg className="w-5 h-5 text-success" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-success font-medium text-sm">Ready to submit! All fields completed.</span>
                </div>
            )}
        </Card>
    </form>
})

export default EntryForm