import React, { useState, useEffect } from 'react';
import EntryForm from "./components/entryform"
import Layout from './components/layout'
import { questions } from "../data/formdata";



const Admin = () => {
    let [currentAdminEntry, setCurrentAdminEntry] = useState<any>();
    useEffect(() => {
        async function fetchData() {
            const winningEntryResponse = await fetch('/api/winningentry/2023');
            let test = await winningEntryResponse.json()
            console.log(test);
            setCurrentAdminEntry(test);
        }

        fetchData();
    }, []);

    let questions = !!currentAdminEntry && Object.entries(currentAdminEntry.entry)
        .filter(([key]) => !isNaN(parseFloat(key)) && isFinite(parseFloat(key)))
        .map(([, value]) => value);

    return <Layout>
        <div className="jumbotron jumbotron-fluid bg-danger text-white">
            <div className="container">
                <h1 className="display-4">Set Winning Entry</h1>
            </div>
        </div>

        <div className="container mt-3">
            <div className="row">
                <div className="col">
                    {!!currentAdminEntry && <EntryForm questions={questions} endpoint="/api/winningentry/new/2023" year={2023} entry={currentAdminEntry.entry} isAdmin={true} />}
                </div>
            </div>
        </div>
    </Layout>
}

export default Admin
