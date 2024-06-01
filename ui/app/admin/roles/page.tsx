/*
 * Copyright (c) Johannes Grimm 2024.
 */

import {Metadata} from 'next';

import {fetchRoles} from '@/lib/data';

import {columns} from '@/app/ui/admin/roles/columns';
import ListData from '@/app/ui/list-data';

export const metadata: Metadata = {
    title: 'Roles',
};

export default async function Page({
                                       searchParams,
                                   }: {
    searchParams?: {
        query?: string;
        page?: string;
    };
}) {
    const roles = await fetchRoles('');

    return (
        <ListData
            name='Role'
            description='Manage your roles here. You can add, edit, and delete roles.'
            columns={columns}
            data={roles}
            searchParams={searchParams}
        />
    );
}
