/*
 * Copyright (c) Johannes Grimm 2024.
 */

import {Metadata} from 'next';

import BreadCrumb from '@/components/bread-crumb';

import {fetchRole} from '@/lib/data';

import EditRoleForm from '@/app/ui/admin/roles/edit-form';

export const metadata: Metadata = {
    title: 'Edit Role',
};

export default async function Page({params}: { params: { id: string } }) {
    const id = params.id;

    const role = await fetchRole(id);

    return (
        <div className='flex min-h-screen w-full flex-col bg-muted/40'>
            <div className='flex flex-col sm:gap-4 sm:py-4 '>
                <header
                    className='sticky top-0 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6'>
                    <BreadCrumb/>
                </header>
                <main className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8'>
                    <EditRoleForm role={role} id={id}/>
                </main>
            </div>
        </div>
    );
}
