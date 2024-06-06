/*
 * Copyright (c) Johannes Grimm 2024.
 */

import TopNav from '@/app/ui/nav/top-nav';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <div className='flex min-h-screen w-full flex-col'>
        <TopNav />
        <div className='flex min-h-screen w-full flex-col md:overflow-y-auto'>
          {children}
        </div>
      </div>
    </main>
  );
}
