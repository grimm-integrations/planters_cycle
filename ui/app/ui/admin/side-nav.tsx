/*
 * Copyright (c) Johannes Grimm 2024.
 */

'use client';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import clsx from 'clsx';
import { KeyRound, LifeBuoy, Settings, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/admin', icon: Settings, name: 'Settings' },
  { href: '/admin/users', icon: Users, name: 'Users' },
  { href: '/admin/roles', icon: KeyRound, name: 'Roles' },
];

const bottom_links = [
  { href: 'https://r4p1d.xyz', icon: LifeBuoy, name: 'Help' },
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
                      aria-label='Playground'
                      className={clsx('rounded-lg', {
                        'bg-muted': pathname === link.href,
                      })}
                      size='icon'
                      variant='ghost'
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
                      aria-label='Playground'
                      className={clsx('rounded-lg', {
                        'bg-muted': pathname === link.href,
                      })}
                      size='icon'
                      variant='ghost'
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
