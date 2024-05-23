'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from './ui/breadcrumb';

export default function BreadCrumb() {
  const paths = usePathname();
  const pathNames = paths.split('/').filter((path) => path);
  if (pathNames.length === 0) return null;

  return (
    <div>
      <Breadcrumb className=''>
        <BreadcrumbList>
          {pathNames.map((link, index) => {
            let href = `/${pathNames.slice(0, index + 1).join('/')}`;
            let itemLink = link[0].toUpperCase() + link.slice(1, link.length);
            if (pathNames.length !== index + 1)
              return (
                <React.Fragment key={index}>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link href={href}>{itemLink}</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                </React.Fragment>
              );

            return (
              <BreadcrumbItem key={index}>
                <BreadcrumbPage>{itemLink}</BreadcrumbPage>
              </BreadcrumbItem>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
