'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import clsx from 'clsx';

export default function NavLinks({ links }) {
  const pathname = usePathname();
  return (
    <>
      {links.map((link) => {
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'transition-colors hover:text-foreground',
              {
                'text-foreground': pathname === link.href,
              },
              {
                'text-muted-foreground': pathname !== link.href,
              }
            )}
          >
            {link.name}
          </Link>
        );
      })}
    </>
  );
}
