'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
