/*
 * Copyright (c) Johannes Grimm 2024.
 */

'use client';

import clsx from 'clsx';
import { KeyRound, LifeBuoy, Settings, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const links = [
  { name: 'Settings', href: '/admin', icon: Settings },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Roles', href: '/admin/roles', icon: KeyRound },
];

const bottom_links = [
  { name: 'Help', href: 'https://r4p1d.xyz', icon: LifeBuoy },
];

export default function SideNav() {
  const pathname = usePathname();
  return (
    <aside className='inset-y fixed  left-0 z-20 flex h-full flex-col border-r'>
      <TooltipProvider>
        <nav className='grid gap-1 p-2'>
          {links.map((link) => {
            const LinkIcon = link.icon;
            return (
              <Tooltip key={link.name}>
                <TooltipTrigger asChild>
                  <Link href={link.href}>
                    <Button
                      variant='ghost'
                      size='icon'
                      className={clsx('rounded-lg', {
                        'bg-muted': pathname === link.href,
                      })}
                      aria-label='Playground'
                    >
                      <LinkIcon className='size-5' />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side='right' sideOffset={5}>
                  {link.name}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </nav>
        <nav className='mt-auto grid gap-1 p-2'>
          {bottom_links.map((link) => {
            const LinkIcon = link.icon;
            return (
              <Tooltip key={link.name}>
                <TooltipTrigger asChild>
                  <Link href={link.href}>
                    <Button
                      variant='ghost'
                      size='icon'
                      className={clsx('rounded-lg', {
                        'bg-muted': pathname === link.href,
                      })}
                      aria-label='Playground'
                    >
                      <LinkIcon className='size-5' />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side='right' sideOffset={5}>
                  {link.name}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </nav>
      </TooltipProvider>
    </aside>
  );
}
