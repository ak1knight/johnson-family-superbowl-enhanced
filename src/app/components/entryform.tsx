import React, { FormEvent, useContext, useState } from 'react';
import { useRouter } from "next/navigation";
import Card from "./card";
import Scores from './scores';
import Yards from './yards';
import { Question } from "../../data/formdata";
import { FormContext, ValidationErrors } from '@/data/form-context';
import Image from 'next/image';
import { observer } from 'mobx-react';


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

    // Use centralized validation from FormStore
    const validateForm = () => {
        const errors = formStore.getValidationErrors(questions);
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Helper function to clear specific validation error
    const clearValidationError = (errorKey: string) => {
        if (validationErrors[errorKey]) {
            const newErrors = {...validationErrors};
            delete newErrors[errorKey];
            setValidationErrors(newErrors);
        }
    };

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
        
        <Scores />
        {validationErrors.team1Scores && (
            <div className="text-error text-sm ml-2">⚠️ {validationErrors.team1Scores}</div>
        )}
        {validationErrors.team2Scores && (
            <div className="text-error text-sm ml-2">⚠️ {validationErrors.team2Scores}</div>
        )}
        
        <Yards />
        {validationErrors.tiebreakers && (
            <div className="text-error text-sm ml-2">⚠️ {validationErrors.tiebreakers}</div>
        )}
        
        {questions.map((q, i) => <Card key={i} id={`${q.question.toLowerCase().replace(/( |\W)/g, '')}`} title={<span>{q.question} <span className="text-error">*</span></span>} extrainfo={q.extrainfo} >
            { q.options ?
                <div className="flex flex-wrap justify-center w-full gap-2 my-2">
                    {q.options.map((option, index) =>
                        <div className="w-[49%]" key={index} >
                            <button type="button" name={option.name} className={`btn btn-block p-3 ${formStore.questionAnswers[i] == option.name ? "btn-primary border-primary" : "btn-light"} h-24 relative border flex justify-center items-center flex-wrap ${validationErrors[`question_${i}`] ? 'border-error' : ''}`} onClick={() => {
                                formStore.setQuestionAnswer(i, option.name);
                                clearValidationError(`question_${i}`);
                            }}>
                                {!!option.image && <div className='h-full w-1/6 relative'><Image alt="option" src={option.image} className="bg-contain" style={{objectFit: 'contain'}} fill /></div>}
                                {!!option.embed && <div className="w-100 mb-2 mt-1"><div className="embed-responsive embed-responsive-16by9"><iframe className="embed-responsive-item" src={option.embed}></iframe></div></div>}
                                <div className="text-center text-lg grow">{option.name + ' - ' + option.score}</div>
                            </button>
                        </div>
                    )}
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
        
        <Card title={<span>Enter Name <span className="text-error">*</span></span>}>
            <div className="flex justify-content-between gap-2">
                <div className="grow">
                    <input
                        type="text"
                        value={formStore.name}
                        className={`h-full w-full input input-bordered bg-secondary text-xl text-secondary-content ${validationErrors.name ? 'border-error' : ''}`}
                        placeholder="Your name..."
                        onChange={(e) => {
                            formStore.name = e.target.value;
                            clearValidationError('name');
                        }}
                    />
                    {validationErrors.name && (
                        <div className="text-error text-sm mt-1">⚠️ {validationErrors.name}</div>
                    )}
                </div>
                <div className="col-auto">
                    <button
                        type="submit"
                        className={`btn btn-primary btn-lg ${isSubmitting ? 'loading' : ''}`}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <span className="loading loading-spinner loading-sm"></span>
                                Submitting...
                            </>
                        ) : (
                            'Submit'
                        )}
                    </button>
                </div>
            </div>
        </Card>
    </form>
})

export default EntryForm