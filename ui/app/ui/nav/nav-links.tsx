/*
 * Copyright (c) Johannes Grimm 2024.
 */

'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavLinks({
  links,
}: {
  links: {
    href: string;
    name: string;
  }[];
}) {
  const pathname = usePathname();
  return (
    <>
      {links.map((link) => {
        return (
          <Link
            className={clsx(
              'transition-colors hover:text-foreground',
              {
                'text-foreground': pathname === link.href,
              },
              {
                'text-muted-foreground': pathname !== link.href,
              }
            )}
            href={link.href}
            key={link.name}
          >
            {link.name}
          </Link>
        );
      })}
    </>
  );
}
