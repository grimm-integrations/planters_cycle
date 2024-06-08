/*
 * Copyright (c) Johannes Grimm 2024.
 */

import { columns } from '@/app/ui/admin/user/colums';
import ListData from '@/app/ui/list-data';
import { fetchUsers } from '@/lib/repos/user';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Users',
};

/**
 * Renders the page component for managing users.
 *
 * @param searchParams - Optional search parameters for filtering users.
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
  const users = await fetchUsers('');

  return (
    <ListData
      columns={columns}
      data={users}
      description='Manage your users here. You can add, edit, and delete users.'
      isAdmin={true}
      name='User'
      searchParams={searchParams}
    />
  );
}
