/*
 * Copyright (c) Johannes Grimm 2024.
 */

import { columns } from '@/app/ui/admin/roles/columns';
import ListData from '@/app/ui/list-data';
import { fetchRoles } from '@/lib/data';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Roles',
};

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    page?: string;
    query?: string;
  };
}) {
  const roles = await fetchRoles('');

  return (
    <ListData
      columns={columns}
      data={roles}
      description='Manage your roles here. You can add, edit, and delete roles.'
      name='Role'
      searchParams={searchParams}
    />
  );
}
