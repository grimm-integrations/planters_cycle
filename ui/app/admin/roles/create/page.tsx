/*
 * Copyright (c) Johannes Grimm 2024.
 */

import EditRoleForm from '@/app/ui/admin/roles/edit-form';
import BreadCrumb from '@/components/bread-crumb';

import type { Role } from '@prisma/client';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Role',
};

export default function Page() {
  const role: Role = {
    id: 0,
    isDefault: false,
    name: '',
  };
  return (
    <div className='flex min-h-screen w-full flex-col bg-muted/40'>
      <div className='flex flex-col sm:gap-4 sm:py-4 '>
        <header className='sticky top-0 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6'>
          <BreadCrumb />
        </header>
        <main className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8'>
          <div className='size-full place-self-center lg:max-w-2xl'>
            <EditRoleForm edit={false} id='' role={role} />
          </div>
        </main>
      </div>
    </div>
  );
}
