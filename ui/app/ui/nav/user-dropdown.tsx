/*
 * Copyright (c) Johannes Grimm 2024.
 */

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { logoutAction } from '@/lib/actions';
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
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            action={async () => {
              'use server';
              await logoutAction();
            }}
          >
            <button type='submit'>Sign in</button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
