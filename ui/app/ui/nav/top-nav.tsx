/*
 * Copyright (c) Johannes Grimm 2024.
 */

import {Menu, Package2} from 'lucide-react';
import Link from 'next/link';

import {Button} from '@/components/ui/button';
import {Sheet, SheetContent, SheetTrigger} from '@/components/ui/sheet';

import {ModeToggle} from '@/app/ui/theme-toggler';

import NavLinks from './nav-links';
import UserDropdown from './user-dropdown';

export default function TopNav() {
    const links = [
        {name: 'Dashboard', href: '/dashboard'},
        {name: 'Plants', href: '/plants'},
        {name: 'Genetics', href: '/genetics'},
    ];

    return (
        <header className='sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6'>
            <nav
                className='hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6'>
                <Link
                    href='#'
                    className='flex items-center gap-2 text-lg font-semibold md:text-base'
                >
                    <Package2 className='h-6 w-6'/>
                    <span className='sr-only'>Planters Cycle</span>
                </Link>

                <NavLinks links={links}/>
            </nav>
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant='outline' size='icon' className='shrink-0 md:hidden'>
                        <Menu className='h-5 w-5'/>
                        <span className='sr-only'>Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side='left'>
                    <nav className='grid gap-6 text-lg font-medium'>
                        <Link
                            href='#'
                            className='flex items-center gap-2 text-lg font-semibold'
                        >
                            <Package2 className='h-6 w-6'/>
                            <span className='sr-only'>Planters Cycle</span>
                        </Link>
                        <NavLinks links={links}/>
                    </nav>
                </SheetContent>
            </Sheet>
            <div className='flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4'>
                <div className='ml-auto flex-1 sm:flex-initial'>
                    <div className='relative'></div>
                </div>
                <UserDropdown/>
                <ModeToggle/>
            </div>
        </header>
    );
}
