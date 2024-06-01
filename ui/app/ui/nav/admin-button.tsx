/*
 * Copyright (c) Johannes Grimm 2024.
 */

import {auth} from '@/auth';
import Link from 'next/link';

import {
    DropdownMenuItem,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

export default async function AdminButton() {
    const session = await auth();
    let isAdmin = true; // default to true for testing
    if (session?.user.roles?.includes('admin')) isAdmin = true;
    if (!isAdmin) return null;

    return (
        <>
            <DropdownMenuSeparator/>
            <Link
                href='/admin'
                className='text-foreground transition-colors hover:text-foreground'
            >
                <DropdownMenuItem>Admin</DropdownMenuItem>
            </Link>
        </>
    );
}
