'use client'
import React, { useState } from 'react'
import Link from 'next/link'

const Nav = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen)
    }

    const closeDropdown = () => {
        setIsDropdownOpen(false)
    }

    return <div className="navbar bg-secondary text-primary">
        <div className="navbar-start">
            <div className="dropdown">
                <div
                    tabIndex={0}
                    role="button"
                    className="btn btn-ghost lg:hidden"
                    onClick={toggleDropdown}
                >
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
                    className={`menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow ${isDropdownOpen ? 'block' : 'hidden'}`}>
                    <li>
                        <Link href="/" className="nav-link" onClick={closeDropdown}>
                            Entry Form <span className="sr-only">(current)</span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/big_board" className="nav-link" onClick={closeDropdown}>
                            Charlie's Big Board
                        </Link>
                    </li>
                </ul>
            </div>
            <Link href="/" className="btn btn-ghost text-xl">Johnson Family Super Bowl Pool</Link>
        </div>
        <div className="navbar-end hidden lg:flex">
            <ul className="menu menu-horizontal px-1 font-medium">
                <li>
                    <Link href="/" className="nav-link">
                        Entry Form <span className="sr-only">(current)</span>
                    </Link>
                </li>
                <li>
                    <Link href="/big_board" className="nav-link">
                        Charlie's Big Board
                    </Link>
                </li>
            </ul>
        </div>
    </div>
}

export default Nav
