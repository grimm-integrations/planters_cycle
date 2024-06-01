/*
 * Copyright (c) Johannes Grimm 2024.
 */

import {Metadata} from 'next';

import {fetchUsers} from '@/lib/data';

import {columns} from '@/app/ui/admin/user/colums';
import ListData from '@/app/ui/list-data';

export const metadata: Metadata = {
    title: 'Users',
};

export default async function Page({
                                       searchParams,
                                   }: {
    searchParams?: {
        query?: string;
        page?: string;
    };
}) {
    const users = await fetchUsers('');

    return (
        <ListData
            name='User'
            description='Manage your users here. You can add, edit, and delete users.'
            columns={columns}
            data={users}
            searchParams={searchParams}
        />
    );
}
