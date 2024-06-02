/*
 * Copyright (c) Johannes Grimm 2024.
 */
'use client';

import { CompleteUser } from '@/prisma/zod';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { formatDateToLocal } from '@/lib/utils';

import DeleteDropdown from './delete-dropdown';
import Link from 'next/link';

/*
 * Copyright (c) Johannes Grimm 2024.
 */

export const columns: ColumnDef<CompleteUser>[] = [
  {
    accessorKey: 'displayName',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Name
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
  },
  {
    accessorKey: 'email',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Email
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
  },
  {
    accessorKey: 'lastLogin',
    header: 'Last Login',
    meta: {
      className: 'hidden xl:table-cell',
    },
    cell: ({ row }) => {
      return <div>{formatDateToLocal(row.original.lastLogin)}</div>;
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Created at',
    meta: {
      className: 'hidden xl:table-cell',
    },
    cell: ({ row }) => {
      return <div>{formatDateToLocal(row.original.createdAt)}</div>;
    },
  },
  {
    accessorKey: 'roles',
    header: 'Roles',
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
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const user = row.original;
      return <DeleteDropdown user={user} />;
    },
  },
];
