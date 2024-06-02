/*
 * Copyright (c) Johannes Grimm 2024.
 */

'use client';

import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';

import ActionDropdown from './action-dropdown';

import type { Role } from '@prisma/client';
import type { ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<Role>[] = [
  {
    accessorKey: 'name',
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
    cell: ({ row }) => {
      const role = row.original;
      return <ActionDropdown role={role} />;
    },
    id: 'actions',
  },
];
