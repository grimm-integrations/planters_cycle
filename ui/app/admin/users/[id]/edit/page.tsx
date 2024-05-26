import { auth } from '@/auth';
import { fetchUser } from '@/lib/data';
import { Metadata } from 'next';
import BreadCrumb from '@/components/bread-crumb';
import EditUserForm from '@/app/ui/admin/user/edit-form';

export const metadata: Metadata = {
  title: 'Edit User',
};

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;

  const session = await auth();
  if (!session) return <div>Not authenticated</div>;

  const user = await fetchUser(session.user.auth, id);

  return (
    <div className='flex min-h-screen w-full flex-col bg-muted/40'>
      <div className='flex flex-col sm:gap-4 sm:py-4 sm:pl-14'>
        <header className='sticky top-0 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6'>
          <BreadCrumb />
        </header>
        <main className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8'>
          <EditUserForm user={user} />
        </main>
      </div>
    </div>
  );
}
