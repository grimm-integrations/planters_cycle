/*
 * Copyright (c) Johannes Grimm 2024.
 */
'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDateToLocal } from '@/lib/utils';
import { ArrowUpDown } from 'lucide-react';
import Link from 'next/link';

import DeleteDropdown from './delete-dropdown';

import type { CompleteUser } from '@/prisma/zod';
import type { ColumnDef } from '@tanstack/react-table';

/*
 * Copyright (c) Johannes Grimm 2024.
 */

export const columns: ColumnDef<CompleteUser>[] = [
  {
    accessorKey: 'displayName',
    header: ({ column }) => {
      return (
        <Button
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          variant='ghost'
        >
          Name
          <ArrowUpDown className='ml-2 size-4' />
        </Button>
      );
    },
  },
  {
    accessorKey: 'email',
    header: ({ column }) => {
      return (
        <Button
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          variant='ghost'
        >
          Email
          <ArrowUpDown className='ml-2 size-4' />
        </Button>
      );
    },
  },
  {
    accessorKey: 'lastLogin',
    cell: ({ row }) => {
      return <div>{formatDateToLocal(row.original.lastLogin)}</div>;
    },
    header: 'Last Login',
    meta: {
      className: 'hidden xl:table-cell',
    },
  },
  {
    accessorKey: 'createdAt',
    cell: ({ row }) => {
      return <div>{formatDateToLocal(row.original.createdAt)}</div>;
    },
    header: 'Created at',
    meta: {
      className: 'hidden xl:table-cell',
    },
  },
  {
    accessorKey: 'roles',
    cell: ({ row }) => {
      const user = row.original;
      return (
        <>
          <div className='flex w-full'>
            {user.roles.map((role) => {
              return (
                <div className='flex-initial p-0.5' key={role.role.id}>
                  <Link href={`/admin/roles/${role.roleId}/edit`}>
                    <Badge>{role.role.name}</Badge>
                  </Link>
                </div>
              );
            })}
          </div>
        </>
      );
    },
    header: 'Roles',
  },
  {
    cell: ({ row }) => {
      const user = row.original;
      return <DeleteDropdown user={user} />;
    },
    id: 'actions',
  },
];
