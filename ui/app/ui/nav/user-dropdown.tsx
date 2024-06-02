/*
 * Copyright (c) Johannes Grimm 2024.
 */

import { signOut } from '@/auth';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CircleUser } from 'lucide-react';

import AdminButton from './admin-button';

export default function UserDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className='rounded-full' size='icon' variant='secondary'>
          <CircleUser className='size-5' />
          <span className='sr-only'>Toggle user menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuItem>Support</DropdownMenuItem>
        <AdminButton />
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <form
            action={async () => {
              'use server';
              await signOut();
            }}
          >
            <button type='submit'>Sign in</button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
