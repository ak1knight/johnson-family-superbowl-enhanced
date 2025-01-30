import React, { useState } from 'react'
import Layout from './components/layout';
import Card from './components/card';
import PropBetBoardTable from './components/propbetboardtable';


const PropBetBoard = () => {
    const [year, setYear] = useState(2023);

    return <Layout>
        <div className="jumbotron jumbotron-fluid bg-primary text-white">
            <div className="container">
                <h1 className="display-4">The Big Board</h1>
            </div>
        </div>
        <div className="container mt-3">
            <ul className="nav nav-tabs mb-3">
                {[2020, 2021, 2022, 2023].map(y => <li key={y} className="nav-item">
                    <a className={`nav-link ${y === year ? 'active' : ''}`} href="#" onClick={() => setYear(y)}>{y}</a>
                </li>)}
            </ul>
            <Card>
                <div className="table-responsive">
                    <PropBetBoardTable year={year} />
                </div>
            </Card>
        </div>
    </Layout>
}


export default PropBetBoard
