/*
 * Copyright (c) Johannes Grimm 2024.
 */

import { auth } from '@/auth';
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';

export default async function AdminButton() {
  const session = await auth();
  let isAdmin = true; // default to true for testing
  if (session?.user.roles?.includes('admin')) isAdmin = true;
  if (!isAdmin) return null;

  return (
    <>
      <DropdownMenuSeparator />
      <Link
        className='text-foreground transition-colors hover:text-foreground'
        href='/admin'
      >
        <DropdownMenuItem>Admin</DropdownMenuItem>
      </Link>
    </>
  );
}
