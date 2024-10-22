/*
 * Copyright (c) Johannes Grimm 2024.
 */

import { columns } from '@/app/ui/genetics/columns';
import ListData from '@/app/ui/list-data';
import { fetchGenetics } from '@/lib/repos/genetic';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Genetics',
};

/**
 * Renders the page component for managing genetics.
 *
 * @param searchParams - Optional search parameters for filtering genetics.
 * @returns The rendered page component.
 */
export default async function Page({
  searchParams,
}: {
  searchParams?: {
    page?: string;
    query?: string;
  };
}) {
  const genetics = await fetchGenetics('');

  return (
    <ListData
      columns={columns}
      data={genetics}
      description='Manage your genetics here. You can add, edit, and delete genetics.'
      name='Genetic'
      searchParams={searchParams}
    />
  );
}
