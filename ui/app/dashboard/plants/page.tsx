/*
 * Copyright (c) Johannes Grimm 2024.
 */

import ListData from '@/app/ui/list-data';
import { columns } from '@/app/ui/plants/columns';
import { fetchPlants } from '@/lib/data';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Plants',
};

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    page?: string;
    query?: string;
  };
}) {
  const plants = await fetchPlants('');

  return (
    <ListData
      columns={columns}
      data={plants}
      description='Manage your plants here. You can add, edit, and delete plants.'
      name='Plant'
      searchParams={searchParams}
    />
  );
}
