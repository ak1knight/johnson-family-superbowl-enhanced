'use client'

import React from 'react';
import LiveWinningEntryForm from "../components/LiveWinningEntryForm"
import Layout from '../components/layout'
import { questions, getLatestAvailableYear } from "../../data/formdata";
import NFLThemeDropdown from '../components/NFLThemeDropdown';

const AdminLivePage = () => {
    const currentYear = getLatestAvailableYear();
    
    return (
        <div className='container m-auto'>
            <div className="bg-primary text-base-100 h-72 relative rounded-b-lg mb-2">
                <div className="container m-auto h-full flex items-center p-8">
                    <div className="flex-grow">
                        <h1 className="lg:text-5xl text-xl">Live Winning Entry Updates</h1>
                        <p className="lead">Enter actual game results as they happen</p>
                    </div>
                    <NFLThemeDropdown />
                </div>
            </div>
            {/* <div className="jumbotron jumbotron-fluid bg-info text-white">
                <div className="container">
                    <h1 className="display-4">Live Winning Entry Updates</h1>
                    <p className="lead">Enter actual game results as they happen</p>
                </div>
            </div> */}

            <div className="container mt-3">
                <LiveWinningEntryForm questions={questions[currentYear]} year={parseInt(currentYear)} />
            </div>
        </div>
    );
};

export default AdminLivePage;