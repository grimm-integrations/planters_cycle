/*
 * Copyright (c) Johannes Grimm 2024.
 */

import { columns } from '@/app/ui/admin/user/colums';
import ListData from '@/app/ui/list-data';
import { fetchUsers } from '@/lib/data';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Users',
};

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    page?: string;
    query?: string;
  };
}) {
  const users = await fetchUsers('');

  return (
    <ListData
      columns={columns}
      data={users}
      description='Manage your users here. You can add, edit, and delete users.'
      name='User'
      searchParams={searchParams}
    />
  );
}
