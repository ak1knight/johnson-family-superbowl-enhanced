'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const PropBetBoard = () => {
    const router = useRouter();

    useEffect(() => {
        // Redirect to the unified dashboard
        router.push('/big_board');
    }, [router]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral via-base-100 to-neutral/50 flex items-center justify-center">
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body text-center">
                    <h2 className="card-title justify-center">Redirecting...</h2>
                    <p>Taking you to the unified Results Dashboard</p>
                    <div className="flex justify-center mt-4">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropBetBoard
