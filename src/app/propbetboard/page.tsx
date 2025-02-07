'use client'

import React, { useState } from 'react'
import Card from '../components/card';
import PropBetBoardTable from '../components/propbetboardtable';
import ThemeDropdown from '../components/themedropdown';


const PropBetBoard = () => {
    const [year, setYear] = useState(2025);

    return <div className='container m-auto'>
    <div className="bg-primary text-base-100 h-72 relative rounded-b-lg mb-2">
        <div className="container m-auto h-full flex items-center p-8">
            <h1 className="text-9xl">Prop Bet Big Board</h1>
            <ThemeDropdown />
        </div>
    </div>
    <div className="container">
        <ul role="tablist" className="tabs tabs-boxed mb-2">
                {[2020, 2021, 2022, 2023, 2024, 2025].map(y => <a role='tab' key={y} className={`tab ${y === year ? 'tab-active' : ''}`} href="#" onClick={() => setYear(y)}>{y}</a>)}
            </ul>
            <Card>
                <div className="table-responsive">
                    <PropBetBoardTable year={year} />
                </div>
            </Card>
        </div>
    </div>
}


export default PropBetBoard
