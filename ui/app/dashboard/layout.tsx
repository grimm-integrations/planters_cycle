/*
 * Copyright (c) Johannes Grimm 2024.
 */

import TopNav from '@/app/ui/nav/top-nav';

export default function Layout({children}: { children: React.ReactNode }) {
    return (
        <main>
            <div className='flex min-h-screen w-full flex-col'>
                <TopNav/>
                <div className='flex-grow p-6 md:overflow-y-auto md:p-12'>
                    {children}
                </div>
            </div>
        </main>
    );
}
