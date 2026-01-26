import React from 'react'
import Link from 'next/link'

const Nav = () => {
    return <div className="navbar bg-secondary text-primary">
        <div className="navbar-start">
            <div className="dropdown">
                <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h8m-8 6h16" />
                    </svg>
                </div>
                <ul
                    tabIndex={0}
                    className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                    <li>
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
            <a className="btn btn-ghost text-xl">Johnson Family Super Bowl Pool</a>
        </div>
        <div className="navbar-end hidden lg:flex">
            <ul className="menu menu-horizontal px-1 font-medium">
                <li>
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
}

export default Nav
