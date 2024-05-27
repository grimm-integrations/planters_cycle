'use client';

import { User } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { formatDateToLocal } from '@/lib/utils';

import DeleteDropdown from './delete-dropdown';

export const columns: ColumnDef<User>[] = [
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
    id: 'actions',
    cell: ({ row }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const user = row.original;
      return <DeleteDropdown user={user} />;
    },
  },
];
