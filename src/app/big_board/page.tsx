'use client'

import React, { useState } from 'react';
import Card from '../components/card';
import BigBoardTable from "../components/bigboardtable";
import ThemeDropdown from '../components/themedropdown';


const BigBoard = () => {
    const [year, setYear] = useState(2025);

    return <div className='container m-auto'>
        <div className="bg-primary text-base-100 h-72 relative rounded-b-lg mb-2">
            <div className="container m-auto h-full flex items-center p-8">
                <h1 className="text-9xl">The Big Board</h1>
                <ThemeDropdown />
            </div>
        </div>
        <div className="container">
            <ul role="tablist" className="tabs tabs-boxed mb-2">
                {[2020, 2021, 2022, 2023, 2024, 2025].map(y => <a role='tab' key={y} className={`tab ${y === year ? 'tab-active' : ''}`} href="#" onClick={() => setYear(y)}>{y}</a>)}
            </ul>
            <Card>
                <div className="table-responsive">
                    <BigBoardTable year={year} />
                </div>
            </Card>
        </div>
    </div>
}


export default BigBoard
