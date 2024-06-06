/*
 * Copyright (c) Johannes Grimm 2024.
 */

import { ModeToggle } from '@/app/ui/theme-toggler';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Package2 } from 'lucide-react';
import Link from 'next/link';

import NavLinks from './nav-links';
import UserDropdown from './user-dropdown';

export default function TopNav() {
  const links = [
    { href: '/dashboard', name: 'Dashboard' },
    { href: '/dashboard/plants', name: 'Plants' },
    { href: '/dashboard/genetics', name: 'Genetics' },
  ];

  return (
    <header className='sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6'>
      <nav className='hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6'>
        <Link
          className='flex items-center gap-2 text-lg font-semibold md:text-base'
          href='#'
        >
          <Package2 className='size-6' />
          <span className='sr-only'>Planters Cycle</span>
        </Link>

        <NavLinks links={links} />
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button className='shrink-0 md:hidden' size='icon' variant='outline'>
            <Menu className='size-5' />
            <span className='sr-only'>Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side='left'>
          <nav className='grid gap-6 text-lg font-medium'>
            <Link
              className='flex items-center gap-2 text-lg font-semibold'
              href='#'
            >
              <Package2 className='size-6' />
              <span className='sr-only'>Planters Cycle</span>
            </Link>
            <NavLinks links={links} />
          </nav>
        </SheetContent>
      </Sheet>
      <div className='flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4'>
        <div className='ml-auto flex-1 sm:flex-initial'>
          <div className='relative'></div>
        </div>
        <UserDropdown />
        <ModeToggle />
      </div>
    </header>
  );
}
