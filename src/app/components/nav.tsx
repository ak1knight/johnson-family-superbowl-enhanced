import React from 'react'
import Link from 'next/link'

const Nav = () => {
    return <nav className="navbar bg-secondary text-base-100">
        <div className="container mx-auto">
            <a className="navbar-brand mb-0 h1" href="#">Johnson Family Super Bowl Pool</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav mr-auto">
                    <li className={`nav-item`}>
                        <Link href="/" legacyBehavior>
                            <a className="nav-link">Entry Form <span className="sr-only">(current)</span></a>
                        </Link>
                    </li>
                    <li className={`nav-item`}>
                        <Link href="/big_board" legacyBehavior>
                            <a className="nav-link">The Big Board</a>
                        </Link>
                    </li>
                    <li className={`nav-item`}>
                        <Link href="/propbetboard" legacyBehavior>
                            <a className="nav-link">Prop Bet Board</a>
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
}

export default Nav
