'use client'

import React, { useState } from 'react'
import EntryForm from "./components/entryform"
import { questions } from "../data/formdata";
import { FormContext, FormStore } from '@/data/form-context';
import NFLThemeDropdown from './components/NFLThemeDropdown';



const Home = () => {
    const [year, ] = useState(2026);

    return <div className='container m-auto'>
        <div className="bg-primary text-base-100 h-72 relative rounded-b-lg mb-2">
            <div className="container m-auto h-full flex items-center p-8">
                <h1 className="text-9xl">Entry Form</h1>
                <NFLThemeDropdown />
            </div>
        </div>
        <FormContext.Provider value={new FormStore(year.toString())}>
            <EntryForm year={year} questions={questions[year]} />
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
