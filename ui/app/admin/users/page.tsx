import { PlusCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import BreadCrumb from '@/components/bread-crumb';
import { Metadata } from 'next';
import { fetchTotalUserPages, fetchUsers } from '@/lib/data';
import Link from 'next/link';
import UserTableRow from '@/app/ui/admin/user/table-row';
import SearchBar from '@/app/ui/search-bar';
import { DataTable } from '@/app/ui/data-table';
import { columns } from '@/app/ui/admin/user/colums';

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
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  const totalPages = await fetchTotalUserPages(query);
  
  const users = await fetchUsers(query);

  return (
    <div className='flex min-h-screen w-full flex-col bg-muted/40'>
      <div className='flex flex-col sm:gap-4 sm:py-4 '>
        <header className='sticky top-0 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6'>
          <BreadCrumb />
          <SearchBar placeholder='Search...' />
          <div className='flex items-center'>
            <div className='ml-auto flex items-center gap-2'>
              <Link href='/admin/users/create'>
                <Button size='sm' className='h-8 gap-1'>
                  <PlusCircle className='h-3.5 w-3.5' />
                  <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
                    Add User
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        </header>
        <main className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8'>
          <Card>
            <CardHeader>
              <CardTitle>Users</CardTitle>
              <CardDescription>
                Manage your users here. You can add, edit, and delete users.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable columns={columns} data={users} />
              {/* <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className='hidden w-[100px] sm:table-cell'>
                      <span className='sr-only'>Image</span>
                    </TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>eMail</TableHead>
                    <TableHead className='hidden xl:table-cell'>
                      Last Login
                    </TableHead>
                    <TableHead className='hidden xl:table-cell'>
                      Created at
                    </TableHead>
                    <TableHead>
                      <span className='sr-only'>Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users?.map((user) => {
                    return <UserTableRow key={user.id} user={user} />;
                  })}
                </TableBody>
              </Table> */}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
