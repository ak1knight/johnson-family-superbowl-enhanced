'use client'

import React, { useRef, useState } from 'react'
import EntryForm from "./components/entryform"
import { questions } from "../data/formdata";
import { FormContext, FormStore } from '@/data/form-context';
import ThemeDropdown from './components/themedropdown';



const Home = () => {
    const [year, ] = useState(2025);

    // const titleQs = [{question: "Score", short: "Score"}, {question: "Yards", short: "Yards"}, ...questions[year]]

    const items = [{question: "Score"}, {question: "Yards"}, ...questions[year]].map(q => `${q.question.toLowerCase().replace(/( |\W)/g, '')}`)

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const sectionRefs = items.map(() => useRef<HTMLDivElement>(null))

    console.log(sectionRefs)

    return <div className='container m-auto'>
        <div className="bg-primary text-base-100 h-72 relative rounded-b-lg mb-2">
            <div className="container m-auto h-full flex items-center p-8">
                <h1 className="text-9xl">Entry Form</h1>
                <ThemeDropdown />
            </div>
        </div>
        <FormContext.Provider value={new FormStore(year.toString())}>
            <EntryForm year={year} questions={questions[year]} sectionRefs={sectionRefs} />
        </FormContext.Provider>

        <div className="container mt-3">
            {/* <Scrollspy sectionRefs={sectionRefs} >
                {({ currentElementIndexInViewport, elementsStatusInViewport }) => (<div className="row">
                    <div className="col-3-sm">
                        <div id="form-sidebar" className="d-none d-md-flex flex-column list-group" style={{position: "sticky", top: "10px"}}>
                            {titleQs.map((q, i) => (
                                <a className={`list-group-item list-group-item-action ${ currentElementIndexInViewport === i && elementsStatusInViewport[i] ? "active" : "" }`} key={i} href={`#${q.short.toLowerCase().replace(/( |\W)/g, '')}`}>{q.short} {elementsStatusInViewport[i]}</a>
                            ))}
                        </div>
                    </div>
                    <div className="col-sm">
                        <EntryForm year={year} questions={questions[year]} sectionRefs={sectionRefs} />
                    </div>
                </div>)}
            </Scrollspy> */}
        </div>
    </div>
}

export default Home
