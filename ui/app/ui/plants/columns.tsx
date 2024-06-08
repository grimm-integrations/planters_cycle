/*
 * Copyright (c) Johannes Grimm 2024.
 */

'use client';

import getPlantStageIcon from '@/components/plantstage-icon';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';

import ActionDropdown from './action-dropdown';

import type { CompletePlant } from '@/prisma/zod';
import type { ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<CompletePlant>[] = [
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
    accessorKey: 'stage',
    cell: ({ row }) => {
      return (
        <div className='flex justify-start px-4'>
          {getPlantStageIcon(row.original.stage)}
          <span>{row.original.stage}</span>
        </div>
      );
    },
    header: ({ column }) => {
      return (
        <Button
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          variant='ghost'
        >
          Stage
          <ArrowUpDown className='ml-2 size-4' />
        </Button>
      );
    },
  },
  {
    accessorKey: 'genetic',
    cell: ({ row }) => {
      return <span className='px-4'>{row.original.genetic.name}</span>;
    },
    header: ({ column }) => {
      return (
        <Button
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          variant='ghost'
        >
          Genetic
          <ArrowUpDown className='ml-2 size-4' />
        </Button>
      );
    },
  },
  {
    cell: ({ row }) => {
      const plant = row.original;
      return (
        <div className='grid min-w-max justify-items-end'>
          <ActionDropdown plant={plant} />
        </div>
      );
    },
    id: 'actions',
  },
];
