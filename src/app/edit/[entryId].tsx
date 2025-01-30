import React, { useState, useEffect, useRef } from 'react';
import { Scrollspy } from '@makotot/ghostui'
import fetch from 'isomorphic-unfetch';
import EntryForm from "../components/entryform"
import Layout from '../components/layout'
import { questions } from "../../data/formdata"; 



const Edit = ({currentEntry, entryId}) => {
    // const router = useRouter();
    // let [currentEntry, setCurrentEntry] = useState();
    // let [entryId] = useState(router.query.entryId);
    
    // useEffect(() => {
    //     async function fetchData() {
    //         const entryResponse = await fetch(`/api/entry/get?entryId=${entryId}`);
    //         let test = await entryResponse.json()
    //         console.log(test);
    //         setCurrentEntry(test);
    //     }

    //     fetchData();
    // }, []);

    // console.log(!!currentEntry && Object.values(currentEntry.entry));
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const sectionRefs = [{question: "Score", short: "Score"}, {question: "Yards", short: "Yards"}, ...questions["2023"]].map(() => useRef<HTMLDivElement>(null))

    return <Layout>
        <div className="jumbotron jumbotron-fluid bg-warning text-white">
            <div className="container">
                <h1 className="display-4">Edit Entry</h1>
            </div>
        </div>

        <div className="container mt-3">
            <Scrollspy sectionRefs={sectionRefs} >
                {({ currentElementIndexInViewport, elementsStatusInViewport }) => (<div className="row">
                    <div className="col-3-sm">
                        <div id="form-sidebar" className="d-none d-md-flex flex-column list-group" style={{position: "sticky", top: "10px"}}>
                            {[{question: "Score", short: "Score"}, {question: "Yards", short: "Yards"}, ...questions["2022"]].map((q, i) => (
                                <a className={`list-group-item list-group-item-action ${ currentElementIndexInViewport === i && elementsStatusInViewport[i] ? "active" : "" }`} key={i} href={`#${q.question.toLowerCase().replace(/( |\W)/g, '')}`}>{!!q.short ? q.short : q.question} {elementsStatusInViewport[i]}</a>
                            ))}
                        </div>
                    </div>
                    <div className="col-sm">
                        <EntryForm questions={Object.values(currentEntry.entry).slice(0, 12)} endpoint={`/api/entry/update?entryId=${entryId}`} entry={currentEntry.entry} sectionRefs={sectionRefs} year={2022} />
                    </div>
                </div>)}
            </Scrollspy>
        </div>

        
    </Layout>
}

Edit.getInitialProps = async ({ req, query }) => {
    const baseUrl = req ? `http://${req.headers.host}` : '';
    const entryResponse = await fetch(`${baseUrl}/api/entry/get?entryId=${query.entryId}`);
    let currentEntry = await entryResponse.json();
    
    return { currentEntry, entryId: query.entryId };
}

export default Edit
