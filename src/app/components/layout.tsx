import React from 'react'
import Head from 'next/head'
import Nav from './nav'

const Layout:React.FC<{title?:string, children: React.ReactNode}> = ({title, children}) => <div>
        <Head>
            <title>{title || 'Home'}</title>
            <link rel="icon" href="/favicon.ico" />
        </Head>

        <Nav />

        {children}
    </div>


export default Layout